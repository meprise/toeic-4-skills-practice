const photoItems = [
  [1, 'A person is examining a bicycle wheel.|Several bicycles are hanging from a ceiling.|A customer is trying on a helmet.|A worker is sweeping the floor.', 0],
  [2, 'Some chairs are being carried outdoors.|Two people are looking at a notice board.|A man is closing a window.|Some papers have fallen onto the floor.', 1],
  [3, 'A customer is pouring a drink.|A sign is being taken down.|A woman is handing over a bag.|Some tables are being moved.', 2],
];
const replies = [
  ['Where should I leave the signed delivery note?', 'After the delivery.|On my desk, please.|Two copies should be enough.', 1],
  ['Have the new security badges arrived yet?', 'Yes, they’re at reception.|The security desk is downstairs.|I arrived before nine.', 0],
  ['Why did the supplier call this morning?', 'At about ten thirty.|I’ll call you tomorrow.|To confirm our order quantity.', 2],
  ['Could you cover the front desk while I’m at lunch?', 'The cover is blue.|Sure, just tell me when you’re leaving.|I had a sandwich.', 1],
  ['Who’s presenting the quarterly figures?', 'The figures are in euros.|They’re on page four.|I believe Grace is.', 2],
  ['Would you prefer a window seat or an aisle seat?', 'An aisle seat, if there is one.|The window is open.|It starts at three.', 0],
  ['I don’t think this key opens the storeroom.', 'It closes at six.|Try the one with the red tag.|I moved the boxes yesterday.', 1],
  ['How often are the air filters replaced?', 'They’re next to the fan.|The replacement is on order.|Every three months.', 2],
  ['Isn’t the west entrance closed this week?', 'It reopened this morning.|It faces the car park.|I usually leave at five.', 0],
];
const conversations = [
  ['Hello, this is Nile Print. We can deliver your conference programmes by Thursday, but the blue card you requested is out of stock.~Thursday is essential. Can you use the same white card as last year?~Certainly. I’ll send a proof this afternoon. Please approve it before five so we can print tomorrow.',
    ['Why is the printer calling?|To change the quantity|To discuss unavailable materials|To collect a payment|To cancel a booking|1','What matters most to the customer?|The delivery date|The paper colour|The size of the programme|The printing price|0','What should the customer do today?|Pick up a sample|Pay a deposit|Approve a proof|Send last year’s file|2']],
  ['I’m checking in for the facilities workshop. My confirmation says Room C.~The projector in C stopped working, so we’re using Room A. It’s across from the lifts.~Thanks. Do I still need to collect a name badge?~Yes, the workshop instructor has them.',
    ['What has changed?|The instructor|The start time|The location|The topic|2','Why was the change made?|Equipment failed|A room was too small|An instructor was delayed|The lifts were closed|0','Where can the visitor get a badge?|At reception|By the lifts|In Room C|From the instructor|3']],
  ['Did the courier take the parcel for Bristol?~No, the label lists our old address as the return address. He said he’ll come back after his next pickup.~I can reprint it now. Can you wait with the parcel while I call the customer to explain the delay?',
    ['What problem was found?|The parcel was open|The label had an old address|The customer cancelled|The courier had the wrong parcel|1','What did the courier say he would do?|Return later|Contact the customer|Bring a new label|Call the Bristol office|0','What does the first speaker ask the colleague to do?|Print a label|Check an invoice|Call the customer|Stay with the parcel|3']],
  ['Good morning. I’m here about the bookkeeping course. The website says Monday classes are full.~They are, but a place opened in the Wednesday class. It meets online in the evening.~That works. Can I pay here?~Registration and payment are both on our website. Choose the option marked Evening Online.',
    ['What does the visitor want to do?|Apply for a job|Join a course|Collect a book|Change a password|1','What is true about the Wednesday class?|It is held online|It starts in the morning|It is fully booked|It has a new teacher|0','How should the visitor pay?|By phone|By bank transfer|Online|At the counter|2']],
  ['We have twelve visitors on Friday and the small meeting room only seats eight.~The training room is free until noon. Their tour finishes at ten, doesn’t it?~Yes. I’ll book the room for ten fifteen. Could you move the welcome sign to that door on Friday morning?',
    ['Why is a different room needed?|A booking was lost|More seats are needed|The tour starts earlier|A room needs cleaning|1','When does the tour end?|At 8:00|At 10:00|At 10:15|At noon|1','What should the colleague move?|A table|A projector|A sign|A box of brochures|2']],
  ['I noticed that the new shipping report shows zero returns for April. That doesn’t look right.~The system uses the date a return is processed. Several April orders came back in May.~Could you add a note explaining the date rule? Our sales team will use that report on Friday.',
    ['What surprised the first speaker?|The number of April returns|The cost of shipping|The number of May orders|The date of a meeting|0','Which date is used in the report?|Purchase date|Dispatch date|Delivery date|Processing date|3','What does the speaker request?|A list of customers|A written clarification|A new database|A meeting with sales|1']],
];
const talks = [
  ['Welcome to Northbank Market. Today’s cooking demonstration has moved from the courtyard to the first-floor café because of the wind. It will still start at eleven. Seats are limited, so collect a free ticket at the information counter near the main entrance.',
    ['Where will the event take place?|At the main entrance|At the information counter|In the café|In the courtyard|2','Why was it moved?|A café has closed|The weather is unsuitable|Too few people registered|A speaker arrived late|1','What must visitors collect?|A recipe card|A shopping bag|A refund|A ticket|3']],
  ['This is a reminder for all staff at Elm Dental. On Tuesday morning, technicians will test the phone system between eight and nine. During that hour, use the online booking system to contact patients. Please report any phone problems that continue after nine to Mira at reception.',
    ['Who is the message for?|Dental staff|Job applicants|Patients|Telephone customers|0','What should listeners use during the test?|A mobile app|The reception phone|The online booking system|Personal email|2','When should ongoing faults be reported?|Before eight|After nine|On Monday|The following week|1']],
  ['Thank you for calling Harlow Cycles. Our repairs desk is open Tuesday through Saturday. If you are calling to check whether a repair is ready, please have the reference number from your receipt handy. To book a new repair, visit our website. Same-day bookings are available for punctures only.',
    ['What does this message mainly provide?|Directions to a new shop|Details about repair services|A product announcement|Instructions for returning a bicycle|1','What should callers have to hand?|A payment card|A bicycle model name|A receipt reference number|Their home address|2','Which service may be booked for the same day?|A brake inspection|A full service|A frame repair|A puncture repair|3']],
  ['Next month, the West Quay Library will begin lending portable chargers to visitors. Borrow one at the main desk by showing a library card. Chargers are for use inside the building and must be handed back before you leave. We have ordered extra units for the examination period in June.',
    ['What new item can visitors borrow?|A laptop|A lamp|A charger|A calculator|2','What must visitors show?|A library card|An examination timetable|A booking receipt|A photo of their device|0','Why did the library order extra units?|Some were damaged|More users are expected during exams|A new branch will open|They are being sold at an event|1']],
  ['If your team is moving to the fourth floor on Monday, label everything with your new desk number by Friday afternoon. The movers will take labelled boxes on Saturday. On Monday morning, go straight to your new desk. If your monitor is missing, log a request on the help desk portal and select Relocation.',
    ['What is the purpose of the announcement?|To announce new office hours|To give instructions for an office move|To advertise office furniture|To explain a desk booking system|1','When will the movers collect boxes?|Friday|Monday|Tuesday|Saturday|3','What should staff do if equipment is missing?|Call the movers|Check reception|Submit an online request|Buy a replacement|2']],
];
const sentences = [
  'Please submit your travel expenses ___ Friday afternoon.|by|from|since|during|0',
  'The new scanner works more ___ than the previous model.|reliable|reliability|reliably|reliance|2',
  'Visitors must ___ their badges before entering the laboratory.|displayed|displaying|displays|display|3',
  'We have enough chairs, ___ we still need another table.|but|because|unless|so that|0',
  'All invoices ___ by the finance team before payment.|check|are checked|have checking|to check|1',
  'The shop will reopen as soon as the repairs ___ complete.|would be|were|are|being|2',
  'The manager thanked the staff for ___ flexibility during the move.|them|themselves|they|their|3',
  'Demand was so high that we ordered an ___ shipment.|additional|addition|additionally|add|0',
  'You won’t need a pass ___ you plan to park overnight.|even though|unless|such as|as if|1',
  'Ms Chen, ___ office is next to the lift, can approve your request.|which|whom|whose|where|2',
  'The final design differs considerably ___ the first proposal.|of|with|for|from|3',
  'Had we received the form earlier, we ___ able to reserve a room.|would have been|will be|were being|have been|0',
];
const cloze = [
  ['To all tenants\n\nThe building’s cycle storage room will be closed [1] Monday for repainting. Please remove your bicycles [2] 6 p.m. on Sunday. [3] The temporary racks are located under the shelter beside the loading bay. Access to the storage room will [4] on Wednesday morning.',
    ['[1]|on|until|across|among|0','[2]|after|by|with|since|1','[3]|The loading bay entrance has been permanently sealed.|The new storage room can only be booked in person.|You can use temporary racks while the work is underway.|No bikes will be allowed anywhere on the property.|2','[4]|resumes|resuming|resumed|resume|3']],
  ['Dear Ms Patel,\n\nThank you for ordering twenty linen aprons from Field Supply. The green aprons are [1] unavailable. Our supplier expects more stock next week, but the date is provisional. [2] If that option suits you, please reply by noon tomorrow. We can then [3] your order without delaying dispatch. The price and delivery address will remain [4].',
    ['[1]|formerly|currently|closely|widely|1','[2]|We can send the same aprons in navy today.|All twenty green aprons have already arrived.|Your delivery address was updated last month.|We no longer sell any linen products.|0','[3]|collecting|revised|adjust|adjustment|2','[4]|unchanged|unchangeably|unchangingly|unchanges|0']],
];
const passages = [
 ['Ridge Print · Collection notice\n\nYour order of 150 brochures is ready. Collect it from the workshop counter between 8 a.m. and 4 p.m. on weekdays. If a colleague collects on your behalf, forward this message to them so they can show the order reference, RP-614. The remaining balance was paid by card yesterday.',
 ['What is ready for collection?|A brochure order|A card reader|A printing machine|A refund|0','What should a colleague show?|A bank statement|A staff badge|The order reference|A new receipt|2','What does the notice say about payment?|It is due before 4 p.m.|It has been completed|It must be made in cash|It was declined|1']],
 ['To: Parkside Gym members\n\nThe upstairs studio will be closed on Thursday while its floor is resealed. The 6 p.m. yoga class will move downstairs to Studio 2. The 7 p.m. dance class is cancelled because no other room is large enough. Members booked for dance will receive a credit automatically by Friday. The changing rooms will remain open.',
 ['Why is a studio closing?|An instructor is away|A floor needs work|Membership has fallen|A class has moved online|1','What change affects yoga participants?|They will start later|They will have a new teacher|They must book again|They should go to a different studio|3','Who will receive a credit?|People booked for dance|All gym members|People using the changing rooms|Yoga instructors|0']],
 ['Mason Museum · Volunteers wanted\n\nHelp visitors find their way around our summer design exhibition. Volunteers work one four-hour shift a week in July and August. No museum experience is required. You must attend an orientation on June 20 or June 22. Apply by June 10 using the form on our website. Shortlisted applicants will be contacted by email.',
 ['What would volunteers do?|Design an exhibition|Guide museum visitors|Repair displays|Write web content|1','What must volunteers attend?|A weekly design class|An interview in August|An orientation session|A tour in July|2','How should people apply?|By filling in an online form|By calling the museum|By posting a letter|By signing up at the exhibition|0']],
 ['Mercer Office Supplies · Return policy\n\nUnopened stationery can be returned within thirty days with proof of purchase. Custom-printed products can only be returned if they are defective. Orders placed online can be returned by post or at any branch. For postal returns, request a return label through your account. The cost of postage is deducted from the refund unless the item was faulty.',
 ['Which purchase can normally be returned?|Opened stationery after a week|Unopened stationery after twenty days|Perfect custom-printed folders|Unopened stationery after forty days|1','How can an online order be returned?|Only to the website warehouse|Only to the original branch|By post or at a branch|Only by courier collection|2','When is postal return postage covered?|When the item was faulty|When the purchase was discounted|When the order was placed in store|When several items are returned|0']],
 ['Haven Hotel · Notice to guests\n\nThe east lift is being serviced from 10 a.m. to 2 p.m. on Wednesday. Please use the west lift next to the restaurant. Guests checking out by noon may ask reception to hold their luggage free of charge. If you require step-free access to the terrace during the work, a member of staff can open the side entrance.',
 ['When is the east lift scheduled to reopen?|At 10 a.m.|At noon|At 2 p.m.|At 4 p.m.|2','What can reception do for departing guests?|Book a table|Store their luggage|Extend their stay automatically|Service the west lift|1','Why might a guest need a staff member?|To access the terrace without stairs|To check the weather|To locate the restaurant|To pay for a room upgrade|0']],
 ['Email from Dev to Alice\n\nCould you order lunch for Tuesday’s safety training? There will be 14 attendees and two trainers. One trainer needs a vegan meal. Please use the company card and keep the cost under £160, including delivery. Training starts at 9:30, and we’ll break for lunch at 12:15.\n\nMenu from Cedar Kitchen\n\nSandwich platter for 8 · £64\nVegan lunch box · £9\nStandard lunch box · £10\nDelivery · £8\nTuesday delivery windows · 11:30–12:00 and 12:30–13:00\nOrders accepted until 3 p.m. on the preceding working day.',
 ['How many people need lunch?|14|15|16|18|2','Which order meets the dietary requirement and budget?|Two sandwich platters only|Sixteen standard lunch boxes|One sandwich platter, seven standard boxes, and one vegan box|Fifteen standard boxes and one vegan box|2','Which delivery window should Alice choose?|11:30–12:00|12:30–13:00|After 3 p.m.|At 9:30|0','By when should Alice order?|Tuesday noon|Monday at 3 p.m.|Tuesday at 9 a.m.|Monday at 5 p.m.|1','Why did Dev mention £160?|It is the trainers’ fee|It is the delivery charge|It is the spending limit|It is the value of a voucher|2']],
 ['Harbour Skills Centre · Workshop schedule\n\nWednesday, 5 March · 9:00 · Presentation Skills · Room 1\nWednesday, 5 March · 14:00 · Spreadsheet Basics · Room 3\nThursday, 6 March · 9:00 · Spreadsheet Basics · Room 3\nThursday, 6 March · 14:00 · Client Negotiation · Room 2\n\nEmail from Leo to Nadia\n\nMy train on Wednesday gets in at 12:40, so I’ll miss the morning workshop. I’ve already done Spreadsheet Basics at work. Could you switch my booking to Client Negotiation? I can stay overnight if needed.\n\nReply from Nadia\n\nI’ve moved your place as requested. There’s a room change due to painting. Please go to the same room that’s listed for Presentation Skills.',
 ['Why can Leo not attend on Wednesday morning?|His train arrives later|He works in Room 3|He has already taken Presentation Skills|He has a client meeting|0','Which workshop has Leo already completed?|Client Negotiation|Presentation Skills|Spreadsheet Basics|An induction course|2','When will Leo’s new workshop begin?|Wednesday at 9:00|Wednesday at 14:00|Thursday at 9:00|Thursday at 14:00|3','Where should Leo go for his new workshop?|Room 1|Room 2|Room 3|The station|0','What caused the room change?|A large attendance|A train delay|Painting work|A cancellation|2']],
];
const speaking = [
 ['Read aloud', 'Thank you for visiting the Eastgate shopping centre. The car park will close at seven this evening while we replace the entrance barriers. If you need to collect your car after seven, please speak to the security team at the main entrance.',45,45],
 ['Read aloud', 'We are pleased to announce that the staff café will begin serving breakfast next Monday. Tea, coffee, and fresh pastries will be available from half past seven. Please let the café team know if you have any suggestions for the new menu.',45,45],
 ['Describe a picture', 'Describe the scene in as much detail as you can.',45,30,4],
 ['Describe a picture', 'Describe the scene in as much detail as you can.',45,30,5],
 ['Respond to questions', 'Think about how you travel to work or school. How do you usually get there, and how long does it take?',3,15],
 ['Respond to questions', 'What do you like most about your usual journey?',3,15],
 ['Respond to questions', 'What one change would make your journey easier? Give a reason.',3,30],
 ['Use provided information', 'What time does registration begin, and where should I go?',3,15],
 ['Use provided information', 'I heard the customer service session starts at 11:30. Is that correct?',3,15],
 ['Use provided information', 'What events are available after lunch? Please give me the details.',3,30],
 ['Express an opinion', 'Some organisations give employees one paid day a year to volunteer in their community. Do you think this is a good policy? Support your answer with reasons and examples.',45,60],
];
const agenda = 'Harbour Business Forum · Saturday\n8:45 Registration · Main lobby\n9:30 Opening talk · Hall A\n11:00 Customer service workshop · Room 2\n12:15 Lunch · Atrium\n13:30 Digital marketing panel · Hall A\n15:00 Networking session · Atrium';
const writing = [
 ['Write one sentence describing the picture. Use both words: boxes / while.',4],
 ['Write one sentence describing the picture. Use both words: cart / between.',5],
 ['Write one sentence describing the picture. Use both words: chairs / beside.',6],
 ['Write one sentence describing the picture. Use both words: window / cleaning.',7],
 ['Write one sentence describing the picture. Use both words: fruit / display.',8],
 ['Email from: Mara, new intern\n\nI’m looking forward to starting on Monday. Could you tell me where to go when I arrive and what I should bring?\n\nWrite a reply. Give two pieces of practical information and ask one question.'],
 ['Email from: Simon, workshop participant\n\nI registered for the Tuesday session, but I now have a meeting at that time. Could you move my booking to another day?\n\nWrite a reply. Offer two alternatives and ask Simon to confirm his preference.'],
 ['Some employers offer staff a choice between working from home and working at the office. Which arrangement do you think works best for most teams? Explain your opinion with reasons and examples. Aim for at least 300 words.'],
];
function item(line) {
  const [prompt, ...choices] = line.split('|');
  const key = Number(choices.pop());
  return { prompt, choices, key };
}
const group = (title, rows, field) => rows.map(([stimulus, questions]) => ({
  title, [field]: stimulus, items: questions.map(item),
}));
const listening = [
  ...photoItems.map(([photo, options, key]) => ({
    title: 'Photographs', photo, audio: options.split('|').map((option, n) => 'ABCD'[n] + '. ' + option).join(' '),
    items: [{ prompt: 'Choose the statement that best describes the picture.', choices: ['A', 'B', 'C', 'D'], key }],
  })),
  ...replies.map(([prompt, options, key]) => ({
    title: 'Question–Response', audio: prompt + ' ' + options.split('|').map((option, n) => 'ABC'[n] + '. ' + option).join(' '),
    items: [{ prompt: 'Choose the best response.', choices: ['A', 'B', 'C'], key }],
  })),
  ...group('Conversations', conversations, 'audio'),
  ...group('Short talks', talks, 'audio'),
];
const reading = [
  ...sentences.map(line => ({ title: 'Incomplete sentences', items: [item(line)] })),
  ...group('Text completion', cloze, 'text'),
  ...group('Reading comprehension', passages, 'text'),
];
for (const section of [listening, reading]) {
  let number = 0;
  section.forEach(block => block.items.forEach(question => { question.number = ++number; }));
}
