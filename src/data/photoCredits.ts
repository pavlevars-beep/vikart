export interface PhotoCredit {
  file: string;
  title: string;
  artist: string;
  license: string;
  source: string;
}

/**
 * Atribucija za fotografije preuzete sa Wikimedia Commons (public domain / CC0 / CC BY / CC BY-SA).
 * Generisano iz metapodataka fajlova prilikom preuzimanja — vidi public/images/_credits.json.
 */
export const photoCredits: PhotoCredit[] = [
  { file: 'zlatibor-hero.jpg', title: 'Zlatibor landscape', artist: 'Grati', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Zlatibor_landscape.jpg' },
  { file: 'zlatibor-view.jpg', title: 'A view on Zlatibor', artist: 'Bukephalos', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:A_view_on_Zlatibor.JPG' },
  { file: 'tornik-gondola.jpg', title: 'Cable Car, Tornik', artist: 'Lemi', license: 'CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:Cable_Car_(96632355).jpeg' },
  { file: 'zlatibor-forest-trail.jpg', title: 'Vrh Čuker, Zlatibor', artist: 'Gzanag', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Vrh_%C4%8Cuker,_Zlatibor_04.jpg' },
  { file: 'stopica-cave-entrance.jpg', title: 'Stopića pećina', artist: 'Brane Blokar', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Stopi%C4%87a_pe%C4%87ina_1759.jpg' },
  { file: 'stopica-cave-inside.jpg', title: 'Stopića pećina, Srbija', artist: 'Gzanag', license: 'CC0', source: 'https://commons.wikimedia.org/wiki/File:Stopi%C4%87a_pe%C4%87ina,_Srbija_01.jpg' },
  { file: 'gostilje-waterfall.jpg', title: 'Гостиљски водопад', artist: 'Ivan25', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:%D0%93%D0%BE%D1%81%D1%82%D0%B8%D1%99%D1%81%D0%BA%D0%B8_%D0%B2%D0%BE%D0%B4%D0%BE%D0%BF%D0%B0%D0%B4_08.jpg' },
  { file: 'gostilje-waterfall-2.jpg', title: 'Gostilje Waterfalls', artist: 'Bukephalos', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Gostilje_Waterfalls.JPG' },
  { file: 'sirogojno-village.jpg', title: 'Sirogojno, centar sela', artist: 'BrankaVV', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Sirogojno,_centar_sela_02.jpg' },
  { file: 'ribnicko-jezero.jpg', title: 'Ribničko jezero', artist: 'Fraudjuric', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Ribni%C4%8Dko_jezero_1.jpg' },
  { file: 'cabin-living-room.jpg', title: 'Cabin living room, Douthat State Park', artist: 'vastateparksstaff', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Cabin_35-_is_3_bedroom_fireplace_living_room_Douthat_State_Park_(17272112178).jpg' },
  { file: 'massage-treatment.jpg', title: 'Spa treatment', artist: 'Deepakyadav78626', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Young-man-spa-treatment-recreation-rest-relaxation-massage-hygh-angle-view.jpg' },
  { file: 'spa-room.jpg', title: 'Spa lounge', artist: 'Sarah Stierch', license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:Lounge_at_the_Spa_at_Silver_Legacy_-_2021-11-14_-_Sarah_Stierch_01.jpg' },
  { file: 'candlelit-dinner.jpg', title: 'Candlelit dinner setup', artist: 'PattayaPatrol', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:DZ6_2648_A_cozy_candlelit_dinner_setup_a_delicate_orchid_soft_lamp_glow_and_an_empty_wine_glass_waiting_for_the_evening_to_begin.jpg' },
  { file: 'candlelit-dinner-2.jpg', title: 'Candlelit dinner tables', artist: 'PattayaPatrol', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:DZ6_2644_Cozy_candlelit_dinner_tables_set_for_an_intimate_evening_at_a_charming_Thai_restaurant.jpg' },
  { file: 'quad-bike.jpg', title: 'KTM Quad 990', artist: 'Stefan Krause, Germany', license: 'CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:KTM_Quad_990_neutral.jpg' },
  { file: 'ebike-trail.jpg', title: 'Folding eBike on Forest Trail', artist: 'Cindy Shebley', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Folding_eBike_on_Forest_Trail_(53104774326).jpg' },
  { file: 'horseback-riding.jpg', title: 'Horseback riding trail, Mt Hood National Forest', artist: 'U.S. Forest Service – Pacific Northwest Region', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Horseback_riding_trail_Mt_Hood_National_Forest_(37003606186).jpg' },
  { file: 'shooting-range.jpg', title: 'Shooting range action', artist: '23IVAN', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Shooting-action-01.jpg' },
  { file: 'bonfire-friends.jpg', title: 'Bonfire', artist: 'Aunaisbhat', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Bonefire.jpg' },
  { file: 'grilled-steak.jpg', title: 'Grilled steak', artist: 'Nenad Stojkovic', license: 'CC BY 4.0', source: 'https://commons.wikimedia.org/wiki/File:Grilled_steak_served_with_orange_slices_and_sauce_on_wooden_board_-_Flickr_-_nenadstojkovicart.jpg' },
  { file: 'karadjordje-steak.jpg', title: 'Traditional Serbian Karađorđe’s steak', artist: 'Nenad Stojkovic', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Traditional_Serbian_Karadjordje%E2%80%99s_Steak_(49153311933).jpg' },
  { file: 'traditional-table.jpg', title: 'Синија', artist: 'Boris Dimitrov', license: 'CC BY 3.0', source: 'https://commons.wikimedia.org/wiki/File:%D0%A1%D0%B8%D0%BD%D0%B8%D1%98%D0%B0.JPG' },
  { file: 'flower-bouquet.jpg', title: 'Bouquet of flowers', artist: 'Miya', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Bouquet_of_white,_pink_and_yellow_flowers.jpg' },
];
