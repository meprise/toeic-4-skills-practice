const app = document.querySelector('#app');
const timer = document.querySelector('#timer');
const names = ['Listening', 'Speaking', 'Reading', 'Writing'];
const budgets = [25, 20, 37, 60];
const empty = () => ({ section: 0, page: 0, deadline: 0, answers: {}, written: {} });
const storageKey = 'elc-toeic-practice-v1';
let state = empty();
try { state = JSON.parse(localStorage.getItem(storageKey)) || state; } catch {}
let phase = '';
let phaseDeadline = 0;
let stream;
let recorder;
let busy = false;
let recordings = {};
let database;
let listeningAudio;
let result;
let persistenceFailed = false;

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); }
  catch { persistenceFailed = true; }
}
function openAudioStore() {
  return new Promise(resolve => {
    const request = indexedDB.open(storageKey, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('recordings');
    request.onerror = () => { persistenceFailed = true; resolve(); };
    request.onblocked = request.onerror;
    request.onsuccess = () => {
      database = request.result;
      const read = database.transaction('recordings').objectStore('recordings').get('attempt');
      read.onsuccess = () => { recordings = read.result || {}; resolve(); };
      read.onerror = () => resolve();
    };
  });
}
function saveAudio() {
  if (!database) { persistenceFailed = true; return Promise.resolve(); }
  return new Promise(resolve => {
    const tx = database.transaction('recordings', 'readwrite');
    tx.objectStore('recordings').put(recordings, 'attempt');
    tx.oncomplete = resolve;
    tx.onerror = () => { persistenceFailed = true; resolve(); };
    tx.onabort = tx.onerror;
  });
}
function el(tag, text, attrs = {}) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
}
function btn(text, action, secondary = false) {
  const node = el('button', text, { type:'button', class: secondary ? 'secondary' : '' });
  node.onclick = action;
  return node;
}
function actions(...nodes) {
  const bar = el('div', undefined, { class:'actions' });
  bar.append(...nodes);
  app.append(bar);
}
function scene(number) {
  const image = el('div', undefined, { role:'img', 'aria-label':'Workplace scene for this question', class:'scene' });
  image.style.backgroundPosition = Number((number - 1) % 4) / 3 * 100 + '% ' + (number > 4 ? 100 : 0) + '%';
  app.append(image);
}
function stimulus(text) { if (text) app.append(el('div', text, { class:'stimulus' })); }
function heading(title, subtitle) {
  app.append(el('h1', title));
  if (subtitle) app.append(el('p', subtitle, { class:'muted' }));
}
function welcome() {
  heading('TOEIC 4-Skills Practice', 'Original, unofficial practice test');
  app.append(el('p','Use headphones and a computer with a microphone. The four sections take up to 2 hours and 22 minutes. You can pause between sections.'));
  const table = el('table');
  const headers = el('tr');
  headers.append(el('th','Section',{scope:'col'}), el('th','Time',{scope:'col'}));
  table.append(headers);
  names.forEach((name,i) => {
    const row = el('tr');
    row.append(el('td',name),el('td',budgets[i]+' min'));
    table.append(row);
  });
  app.append(table, el('p','Your work and recordings stay in this browser. When you finish, download the results file and send it to your teacher.'));
  const file = el('input', undefined, { type:'file', accept:'.json,application/json', 'aria-label':'Open student results' });
  const review = el('details');
  review.append(el('summary','Teacher review'),el('p','Open the results file exported by the student.'),file);
  file.onchange = async () => {
    try {
      const parsed = JSON.parse(await file.files[0].text());
      if (parsed.format !== storageKey || !parsed.answers || !parsed.written || !parsed.recordings) throw Error();
      result = parsed;
      render();
    } catch { review.append(el('p','Choose a results file exported by this practice test.')); }
  };
  actions(btn('Get started', () => { state.started = true; save(); render(); }));
  app.append(review);
}
function ready() {
  const section = state.section;
  heading(names[section], 'Section ' + (section+1) + ' of 4 · ' + budgets[section] + ' minutes');
  const instructions = [
    'Play each clip once and choose the best answers. Headphones are recommended.',
    'Allow microphone access. Each prompt has separate preparation and response times. A recording starts automatically when preparation ends. If your microphone is in use by the video call, you can speak to your teacher live.',
    'Choose one answer per question. You can revisit any reading question until the section ends.',
    'Write five picture sentences, two email replies, and one opinion essay. Suggested pacing is 10 minutes for the pictures, 10 minutes per email, and 30 minutes for the essay.',
  ];
  app.append(el('p',instructions[section]));
  if (section === 0) {
    const sample = el('audio', undefined, { controls:'', src:'./media/sound-check.wav' });
    app.append(el('p','Play this short sound check before starting.'),sample);
  }
  const begin = () => { state.deadline = Date.now() + budgets[section] * 60000; save(); render(); };
  if (section !== 1) {
    actions(btn('Start ' + names[section],begin), btn('Home', () => { state.started=false; save(); render(); },true));
    return;
  }
  const msg = el('p',undefined,{role:'status'});
  const microphone = btn('Enable microphone and start', async () => {
    microphone.disabled = true;
    try {
      if (!window.MediaRecorder || !navigator.mediaDevices) throw Error();
      stream = await navigator.mediaDevices.getUserMedia({audio:true});
      const check = new MediaRecorder(stream);
      check.start();
      check.stop();
      begin();
    } catch {
      releaseMic();
      microphone.disabled = false;
      msg.textContent = 'Microphone access failed. Check your browser permissions or speak to your teacher live.';
    }
  });
  actions(microphone, btn('Speak live to teacher', () => { if (!microphone.disabled) begin(); }, true));
  app.append(msg);
}
function objective() {
  const listen = state.section === 0;
  const blocks = listen ? listening : reading;
  const block = blocks[state.page];
  heading(block.title, names[state.section] + ' · Questions ' + block.items.map(question => question.number).join(', ') + ' of 45');
  if (block.photo) scene(block.photo);
  stimulus(block.text);
  let advance;
  if (listen) {
    const playback = el('p','', { role:'status' });
    const play = btn('Play audio', async () => {
      play.disabled = true;
      const player = new Audio('./media/listen-' + (state.page+1) + '.wav');
      listeningAudio = player;
      playback.textContent = 'Playing…';
      player.onended = () => { if (advance) advance.disabled = false; playback.textContent = 'Audio finished.'; };
      try { await player.play(); } catch { play.disabled = false; playback.textContent = 'Audio could not play. Try again.'; }
    });
    if (state.played?.[state.page]) {
      play.disabled = true;
      playback.textContent = 'Audio already played.';
    }
    const playOnce = play.onclick;
    play.onclick = async () => {
      await playOnce();
      if (play.disabled && app.contains(play)) {
        (state.played ??= {})[state.page] = true;
        save();
      }
    };
    app.append(play,playback);
  }
  block.items.forEach(question => {
    const key = state.section + '-' + question.number;
    const field = el('fieldset');
    field.append(el('legend',question.number + '. ' + question.prompt));
    question.choices.forEach((choice,i) => {
      const label = el('label',undefined,{class:'option'});
      const radio = el('input',undefined,{type:'radio',name:key,value:i});
      radio.checked = state.answers[key] === i;
      radio.onchange = () => { state.answers[key] = i; save(); };
      label.append(radio,document.createTextNode((listen && question.choices[0] === 'A' ? '' : 'ABCD'[i] + '. ') + choice));
      field.append(label);
    });
    app.append(field);
  });
  advance = nav(blocks.length, !listen, listen);
}
function nav(count, backwards, listen = false) {
  const move = number => { state.page = number; save(); render(); window.scrollTo(0,0); };
  const advance = btn(state.page+1 < count ? 'Next' : 'Finish section', () => {
    if (state.page+1 < count) move(state.page+1);
    else if (confirm('Submit this section?')) endSection();
  });
  if (listen) advance.disabled = !state.played?.[state.page];
  actions(...(backwards && state.page > 0 ? [btn('Back', () => move(state.page-1),true)] : []),advance);
  if (backwards) {
    const jump = el('select',undefined,{'aria-label':'Go to question or task'});
    for (let i=0;i<count;i++) {
      const label = state.section === 2 ? 'Question ' + reading[i].items[0].number : 'Task ' + (i+1);
      jump.append(el('option',label,{value:i}));
    }
    jump.value = state.page;
    jump.onchange = () => move(Number(jump.value));
    actions(jump);
  }
  return advance;
}
function writingPage() {
  const [prompt, photo] = writing[state.page];
  heading('Writing', 'Task ' + (state.page+1) + ' of ' + writing.length);
  stimulus(prompt);
  if (photo) scene(photo);
  const input = el('textarea',undefined,{'aria-label':'Your response',spellcheck:'false'});
  const count = el('small');
  const update = () => { count.textContent = (input.value.trim().match(/\S+/g) || []).length + ' words'; };
  input.value = state.written[state.page] || '';
  input.oninput = () => { state.written[state.page] = input.value; save(); update(); };
  update();
  app.append(input,count);
  nav(writing.length,true);
}
function releaseMic() {
  stream?.getTracks().forEach(track => track.stop());
  stream = undefined;
}
function speakingPage() {
  const [type,prompt,prepare,speak,photo] = speaking[state.page];
  heading(type, 'Speaking · Question ' + (state.page+1) + ' of ' + speaking.length);
  if (state.page >= 7 && state.page <= 9) stimulus(agenda);
  if (photo) scene(photo);
  if (phase || state.page < 4) stimulus(prompt);
  const status = el('p','', {role:'status',id:'phase'});
  app.append(status);
  if (!phase) {
    app.append(el('p',prepare + ' seconds to prepare · ' + speak + ' seconds to speak.'));
    if (!stream && navigator.mediaDevices && window.MediaRecorder) {
      actions(btn('Reconnect microphone', async event => {
        const button = event.currentTarget;
        button.disabled = true;
        try { stream = await navigator.mediaDevices.getUserMedia({audio:true}); render(); }
        catch { button.disabled = false; status.textContent = 'Microphone access failed. You can speak live.'; }
      },true));
    }
    if (state.page === 7 && !state.agendaRead) {
      actions(btn('Read schedule for 45 seconds', () => { phase = 'Read the schedule'; phaseDeadline = Date.now()+45000; render(); }));
    } else {
      actions(btn('Start preparation', () => { phase = 'Prepare'; phaseDeadline = Date.now()+prepare*1000; render(); }));
    }
  } else if (phase === 'Speak') {
    actions(btn('Finish response', nextSpeaking));
  }
}
function record() {
  const index = state.page;
  if (!stream) return;
  try {
    recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    recorder.persist = new Promise(resolve => {
      recorder.onstop = async () => {
        if (chunks.length) {
          recordings[index] = new Blob(chunks,{type:chunks[0].type});
          await saveAudio();
        }
        resolve();
      };
    });
    recorder.start();
  } catch { releaseMic(); recorder = undefined; }
}
async function stopRecording() {
  if (!recorder) return;
  const active = recorder;
  recorder = undefined;
  if (active.state !== 'inactive') active.stop();
  await active.persist;
}
async function nextSpeaking() {
  if (busy) return;
  busy = true;
  await stopRecording();
  busy = false;
  phase = '';
  if (state.page+1 >= speaking.length) { await endSection(); return; }
  state.page++;
  save();
  render();
}
async function endSection() {
  if (busy) return;
  busy = true;
  listeningAudio?.pause();
  await stopRecording();
  releaseMic();
  phase = '';
  state.section++;
  state.page = 0;
  state.deadline = 0;
  save();
  busy = false;
  render();
  window.scrollTo(0,0);
}
function asData(blob) {
  return new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
async function download() {
  const audio = {};
  for (const [index, blob] of Object.entries(recordings)) audio[index] = await asData(blob);
  const payload = { format:storageKey, answers:state.answers, written:state.written, recordings:audio };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload)], {type:'application/json'}));
  const anchor = el('a',undefined,{href:url,download:'toeic-practice-results.json'});
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
function showResults() {
  const data = result || state;
  heading(result ? 'Teacher review' : 'Practice results');
  const objectiveResults = [[0,listening],[2,reading]];
  const table = el('table');
  for (const [section,blocks] of objectiveResults) {
    const questions = blocks.flatMap(block => block.items);
    const correct = questions.filter(question => data.answers[section+'-'+question.number] === question.key).length;
    const row = el('tr');
    row.append(el('th',names[section],{scope:'row'}), el('td',correct+' / 45'));
    table.append(row);
  }
  app.append(table);
  if (!result) {
    app.append(el('p','Download your responses and share the file with your teacher for Speaking and Writing feedback.'));
    const status = el('p','',{role:'status'});
    actions(btn('Download results', async () => {
      try { await download(); status.textContent = 'Results file downloaded.'; }
      catch { status.textContent = 'Download failed. Try again before closing this page.'; }
    }));
    app.append(status);
      actions(btn('Start a new attempt', async () => {
      if (!confirm('Clear this attempt from this browser? Download your results first if you want to keep them.')) return;
      recordings = {};
      await saveAudio();
      state = empty();
      save();
      render();
    },true));
  } else actions(btn('Back to start', () => { result=undefined; render(); },true));
  for (const [section,blocks] of objectiveResults) {
    const details = el('details');
    details.append(el('summary',names[section]+' answer review'));
    for (const block of blocks) {
      if (block.audio || block.text) details.append(el('p',(block.audio || block.text).replaceAll('~','\n'),{class:'stimulus'}));
      for (const question of block.items) {
        const chosen = data.answers[section+'-'+question.number];
        details.append(el('p',question.number+'. '+question.prompt+' · Your answer: '+(question.choices[chosen] ?? 'Blank')+' · Key: '+question.choices[question.key]));
      }
    }
    app.append(details);
  }
  const audio = result ? result.recordings : recordings;
  const spoken = el('details');
  spoken.append(el('summary','Speaking responses and marking guide'),el('p','Rate each prompt 0–3. 0 = no usable response. 1 = difficult to understand or little of the task achieved. 2 = mostly understandable and relevant, with omissions or errors. 3 = clear, relevant and complete. For read-aloud items, focus on intelligibility, pronunciation, stress and phrasing. For the other items, consider accuracy, detail and development.'));
  spoken.append(el('p','For questions 8–10, check the answers against this schedule:'), el('p',agenda,{class:'stimulus'}));
  speaking.forEach(([type,prompt],index) => {
    spoken.append(el('h3',(index+1)+'. '+type),el('p',prompt));
    const recording = audio[index];
    spoken.append(recording ? el('audio',undefined,{controls:'',preload:'none',src:result ? recording : URL.createObjectURL(recording)}) : el('p','No recording saved.'));
  });
  const written = el('details');
  written.append(el('summary','Writing responses and marking guide'),el('p','Picture sentences (0–3 each): both words used, accurate description and grammatical sentence. Emails (0–4 each): required points covered, appropriate tone, clear organisation and language. Essay (0–5): clear position, developed reasons and examples, coherence and control of language. Zero indicates a blank, off-topic or unusable response. Award the top mark when the response meets all the criteria, and partial credit for incomplete or weak performance.'));
  writing.forEach(([prompt],index) => {
    written.append(el('h3','Task '+(index+1)),el('p',prompt,{class:'stimulus'}),el('p',data.written[index] || 'No response.',{class:'stimulus'}));
  });
  app.append(spoken,written);
}
function render() {
  app.replaceChildren();
  if (result || state.section >= names.length) showResults();
  else if (!state.started) welcome();
  else if (!state.deadline) ready();
  else if (state.section === 1) speakingPage();
  else if (state.section === 3) writingPage();
  else objective();
  if (persistenceFailed) app.append(el('p','This browser could not save all progress. Keep this tab open until you download your results.',{role:'status'}));
  updateTimers();
}
function updateTimers() {
  const now = Date.now();
  timer.hidden = !state.deadline || !!result;
  if (timer.hidden) return;
  const left = Math.max(0,Math.ceil((state.deadline-now)/1000));
  timer.textContent = Math.floor(left/60) + ':' + String(left%60).padStart(2,'0');
  if (!left) { endSection(); return; }
  if (state.section !== 1 || !phase || busy) return;
  const seconds = Math.max(0,Math.ceil((phaseDeadline-now)/1000));
  const status = document.querySelector('#phase');
  if (status) {
    const text = phase + ' · ' + seconds + ' s' + (phase === 'Speak' && !recorder ? ' · live response' : '');
    if (status.textContent !== text) status.textContent = text;
  }
  if (seconds) return;
  if (phase === 'Speak') { nextSpeaking(); return; }
  if (phase === 'Read the schedule') {
    state.agendaRead = true;
    save();
    phase = '';
  } else {
    phase = 'Speak';
    phaseDeadline = now+speaking[state.page][3]*1000;
    record();
  }
  render();
}
(async () => {
  try { await openAudioStore(); } catch { persistenceFailed = true; }
  render();
  setInterval(updateTimers,200);
})();
