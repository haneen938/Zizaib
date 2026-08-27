// Pakistani-customer testimonials.
export interface Testimonial {
  id: number;
  name: string;
  city?: string;
  date: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  { id: 1, name: "Minha",      city: "Karachi",   date: "Apr 04, 2026", rating: 5, text: "My avocado pouch arrived wrapped so prettily — felt like a little gift to myself. Even sweeter in person 💚" },
  { id: 2, name: "Haniya",     city: "Lahore",    date: "Mar 27, 2026", rating: 5, text: "Bought the sunflower hair string for Eid — I got compliments all day. The stitchwork is so neat MashAllah." },
  { id: 3, name: "Haider Ali", city: "Islamabad", date: "Mar 19, 2026", rating: 5, text: "Got the granny square bag for my sister's birthday. She loved it. Quality is honestly better than I expected for this price." },
  { id: 4, name: "Taniya",     city: "Karachi",   date: "Mar 11, 2026", rating: 5, text: "The cat glasses pouch is the cutest thing in my house now. Soft inside, holds my sunglasses perfectly." },
  { id: 5, name: "Zainab",     city: "Multan",    date: "Feb 28, 2026", rating: 4, text: "Lovely heart charm for my glasses — finally feels personal! Shipping was a bit slow but worth the wait." },
  { id: 6, name: "Hadiya",     city: "Rawalpindi", date: "Feb 17, 2026", rating: 5, text: "The forever daisy bouquet is sitting on my study desk and it genuinely brightens my mornings. Such a thoughtful idea." },
  { id: 7, name: "Areeba",     city: "Faisalabad", date: "Feb 06, 2026", rating: 5, text: "Tote bag is roomy, sturdy, and looks expensive. Carrying it to uni every day now." },
  { id: 8, name: "Mahnoor",    city: "Lahore",    date: "Jan 25, 2026", rating: 5, text: "Ordered the rose bracelet — it's so dainty, and the rose hasn't lost its shape after weeks of wearing it." },
  { id: 9, name: "Sara",       city: "Karachi",   date: "Jan 12, 2026", rating: 5, text: "The crochet watch band is genius. My old watch feels brand new. Will be ordering more colors!" },
  { id: 10, name: "Eshal",     city: "Peshawar",  date: "Dec 30, 2025", rating: 5, text: "Bought matching daisy keychains for my friends — everyone was obsessed. Will reorder for sure." },
];
