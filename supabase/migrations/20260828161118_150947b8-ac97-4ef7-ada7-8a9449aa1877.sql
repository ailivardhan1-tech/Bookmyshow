INSERT INTO public.cities (name, sort_order) VALUES
 ('Mumbai',1),('Hyderabad',2),('Bangalore',3),('Delhi NCR',4),
 ('Chennai',5),('Pune',6),('Kolkata',7),('Ahmedabad',8);

INSERT INTO public.titles (id, kind, category, name, poster_key, backdrop_key, languages, formats, rating, votes, certification, duration, release_label, genres, synopsis, venue, date_label, price_from, sort_order) VALUES
('nebula-protocol','movie','Movies','Nebula Protocol','poster-1','hero-1',
 ARRAY['English','Hindi','Telugu'], ARRAY['2D','3D','IMAX 3D'], 8.9,'142.3K','UA','2h 41m','22 Aug, 2026',
 ARRAY['Sci-Fi','Action','Thriller'],
 'When a deep-space listening post picks up a signal that predates the solar system, Commander Ira Vance is pulled out of retirement for one last jump beyond the Kuiper belt. What her crew finds inside the crimson nebula is not a civilisation — it is a warning, encoded in the physics of the universe itself. As the protocol activates, Vance must decide whether humanity deserves the answer it has been screaming for.',
 NULL,NULL,190,1),
('monsoon-letters','movie','Movies','Monsoon Letters','poster-2','poster-2',
 ARRAY['Hindi','Marathi'], ARRAY['2D','4K'], 8.2,'78.6K','UA','2h 12m','15 Aug, 2026',
 ARRAY['Romance','Drama'],
 'Two strangers keep missing each other across a rain-soaked Mumbai — until a stack of undelivered letters from 1994 begins to write their future. A tender, rain-lit story about timing, memory and the courage to stay.',
 NULL,NULL,150,2),
('crimson-alley','movie','Movies','Crimson Alley','poster-3','poster-3',
 ARRAY['English','Tamil','Hindi'], ARRAY['2D','IMAX 3D'], 7.8,'54.1K','A','2h 05m','29 Aug, 2026',
 ARRAY['Crime','Thriller','Noir'],
 'A burnt-out detective works a case the department closed twelve years ago. Every lead ends in the same neon alley, and every witness remembers a different man walking out of it.',
 NULL,NULL,170,3),
('dragoon-tales','movie','Movies','Dragoon Tales','poster-4','poster-4',
 ARRAY['English','Hindi','Telugu','Kannada'], ARRAY['2D','3D'], 8.5,'96.4K','U','1h 46m','08 Aug, 2026',
 ARRAY['Animation','Family','Adventure'],
 'A curious girl and a very anxious young dragon set out to return a stolen season to their valley. Warm, funny and impossibly pretty — a treat for the whole family.',
 NULL,NULL,130,4),
('sunburn-arena','event','Events','Sunburn Arena · Neon Nights','event-1','event-1',
 ARRAY['English'], ARRAY['Live'], 9.1,'31.2K','18+','5h','12 Sep, 2026',
 ARRAY['Music','EDM','Festival'],
 'The biggest open-air electronic night of the year returns with a 360° stage, three arenas and a headline set that runs till sunrise.',
 'Mahalaxmi Race Course, Mumbai','Sat, 12 Sep · 5:00 PM',1499,5),
('punchline-live','event','Stand-up Comedy','Punchline Live · Unfiltered','event-2','event-2',
 ARRAY['Hindi','English'], ARRAY['Live'], 8.7,'12.8K','16+','1h 30m','05 Sep, 2026',
 ARRAY['Comedy','Live Show'],
 'A brand new hour of material, worked out on stage in front of you. No filter, no teleprompter, no mercy.',
 'The Habitat, Khar West','Fri, 05 Sep · 8:30 PM',599,6),
('premier-clash','event','Sports','Premier Clash · Final','event-3','event-3',
 ARRAY['English','Hindi'], ARRAY['Live'], 9.4,'88.9K','U','4h','20 Sep, 2026',
 ARRAY['Cricket','Sports'],
 'The season finale under the lights. Two unbeaten sides, one trophy, and a stadium that has sold out every year for a decade.',
 'Wankhede Stadium, Mumbai','Sun, 20 Sep · 7:00 PM',999,7);

INSERT INTO public.cast_members (title_id, name, role, initials, sort_order) VALUES
('nebula-protocol','Aria Menon','Cmdr. Ira Vance','AM',1),
('nebula-protocol','Dev Kapoor','Lt. Rehan','DK',2),
('nebula-protocol','Lucas Grey','Dr. Holt','LG',3),
('nebula-protocol','Sana Iyer','Mission Control','SI',4),
('nebula-protocol','Rohan Das','Director','RD',5),
('monsoon-letters','Ishaan Rao','Aditya','IR',1),
('monsoon-letters','Meher Shah','Naina','MS',2),
('monsoon-letters','Kabir Sen','Postmaster','KS',3),
('monsoon-letters','Tara Nair','Ruhi','TN',4),
('crimson-alley','Vikram Joshi','Det. Salvi','VJ',1),
('crimson-alley','Nadia Khan','Reyna','NK',2),
('crimson-alley','Arjun Pillai','Informant','AP',3),
('dragoon-tales','Nira Bose','Voice of Mira','NB',1),
('dragoon-tales','Sam Antony','Voice of Pip','SA',2),
('dragoon-tales','Lea Fernandes','Voice of Elder','LF',3),
('sunburn-arena','DJ Halcyon','Headliner','DH',1),
('sunburn-arena','Nocturne','Support','NO',2),
('sunburn-arena','Aurea','Opening','AU',3),
('punchline-live','Rahul Vaid','Performer','RV',1),
('punchline-live','Simi Ghosh','Opener','SG',2),
('premier-clash','Home XI','Team','HX',1),
('premier-clash','Challengers','Team','CH',2);

INSERT INTO public.hero_slides (id, title_id, image_key, tag, title, subtitle, sort_order) VALUES
('nebula-protocol','nebula-protocol','hero-1','Now Showing · IMAX 3D','Nebula Protocol','The signal was never meant for us.',1),
('sunburn-arena','sunburn-arena','event-1','This September · Live','Sunburn Arena','Neon Nights · Mumbai · 3 arenas',2),
('premier-clash','premier-clash','event-3','Sports · Final','Premier Clash Final','Wankhede under the lights',3);

INSERT INTO public.theaters (id, name, area, distance, cancellable, amenities, sort_order) VALUES
('pvr-icon','PVR ICON: Phoenix Palladium','Lower Parel','2.4 km',true,ARRAY['Dolby Atmos','Recliners','Food Court'],1),
('inox-atria','INOX: Atria Mall','Worli','4.1 km',true,ARRAY['4K Laser','Recliners','Parking'],2),
('cinepolis-vr','Cinépolis: VR Mall','Andheri West','8.7 km',false,ARRAY['Dolby Atmos','Food Court'],3),
('carnival-imax','Carnival IMAX: Wadala','Wadala','11.2 km',true,ARRAY['IMAX','Dolby Atmos','Recliners','Valet'],4);

INSERT INTO public.shows (theater_id, time_label, format, status, price, sort_order) VALUES
('pvr-icon','09:15 AM','2D','available',190,1),
('pvr-icon','12:40 PM','IMAX 3D','filling',420,2),
('pvr-icon','04:20 PM','3D','available',310,3),
('pvr-icon','07:50 PM','IMAX 3D','almost',490,4),
('pvr-icon','11:10 PM','2D','available',250,5),
('inox-atria','10:00 AM','2D','available',160,1),
('inox-atria','01:30 PM','4K','available',220,2),
('inox-atria','06:15 PM','2D','filling',260,3),
('inox-atria','09:45 PM','4K','almost',330,4),
('cinepolis-vr','08:45 AM','2D','available',140,1),
('cinepolis-vr','02:10 PM','3D','available',240,2),
('cinepolis-vr','08:30 PM','3D','filling',290,3),
('carnival-imax','11:20 AM','IMAX 3D','available',450,1),
('carnival-imax','03:55 PM','IMAX 3D','filling',470,2),
('carnival-imax','10:30 PM','IMAX 3D','almost',520,3);

INSERT INTO public.fnb_items (id, category, name, description, price, emoji, sort_order) VALUES
('p1','Popcorn','Salted Popcorn (Large)','Freshly popped, lightly salted',320,'🍿',1),
('p2','Popcorn','Caramel Popcorn (Medium)','Sweet caramel glaze',280,'🍿',2),
('p3','Popcorn','Cheese Popcorn (Large)','Loaded cheddar dust',350,'🧀',3),
('b1','Beverages','Pepsi (Large)','750 ml chilled',260,'🥤',4),
('b2','Beverages','Cold Coffee','Double shot, whipped cream',240,'☕',5),
('b3','Beverages','Mineral Water','500 ml',60,'💧',6),
('c1','Combos','Couple Combo','2 popcorn tubs + 2 drinks',749,'🎬',7),
('c2','Combos','Family Feast','Jumbo popcorn + 4 drinks + nachos',1199,'🎉',8),
('s1','Snacks','Loaded Nachos','Salsa, cheese sauce, jalapeños',330,'🌮',9),
('s2','Snacks','Peri Peri Fries','Crispy, spicy, addictive',250,'🍟',10),
('s3','Snacks','Veg Puff','Flaky, hot from the oven',120,'🥐',11);

INSERT INTO public.coupons (code, label, discount, active, sort_order) VALUES
('FIRST150','₹150 off on your first booking',150,true,1),
('UPI50','Flat ₹50 off paying via UPI',50,true,2),
('WEEKEND100','₹100 off on weekend shows',100,true,3);

INSERT INTO public.seat_tiers (name, price, seat_rows, cols, sort_order) VALUES
('Recliner',690,ARRAY['A','B'],10,1),
('Prime',350,ARRAY['C','D','E','F'],16,2),
('Classic',210,ARRAY['G','H','J','K'],16,3);