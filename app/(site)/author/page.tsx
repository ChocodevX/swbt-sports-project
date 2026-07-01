// "use client";

// import ProfileCard from "@/components/ProfileCard";

// const AVATAR = "/person.webp";

// // Three author mockups for the team behind Sarsas Contest.
// const authors = [
//   {
//     name: "Javi A. Torres",
//     title: "Lead Engineer",
//     handle: "javicodes",
//     status: "Online",
//     contactText: "Connect",
//     // Social media link the Connect button opens.
//     contactUrl: "https://github.com/javicodes",
//     innerGradient: "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)",
//     behindGlowColor: "rgba(0, 190, 255, 0.67)",
//   },
//   {
//     name: "Mia Chen",
//     title: "Product Designer",
//     handle: "miadesigns",
//     status: "Away",
//     contactText: "Say Hi",
//     contactUrl: "https://twitter.com/miadesigns",
//     innerGradient: "linear-gradient(145deg,#6e495a8c 0%,#FF71C444 100%)",
//     behindGlowColor: "rgba(255, 125, 190, 0.6)",
//   },
//   {
//     name: "Leo Park",
//     title: "Motion Engineer",
//     handle: "leomoves",
//     status: "Online",
//     contactText: "Connect",
//     contactUrl: "https://www.linkedin.com/in/leomoves",
//     innerGradient: "linear-gradient(145deg,#496e588c 0%,#71FFB444 100%)",
//     behindGlowColor: "rgba(125, 255, 190, 0.55)",
//   },
// ];

// export default function AuthorPage() {
//   return (
//     <section className="py-8">
//       <h1 className="mb-2 text-4xl font-bold tracking-tight">Authors</h1>
//       <p className="mb-10 text-slate-400">
//         The team building Sarsas Contest. Hover the cards to tilt them.
//       </p>

//       <div className="grid justify-items-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
//         {authors.map((author) => (
//           <ProfileCard
//             key={author.handle}
//             avatarUrl={AVATAR}
//             miniAvatarUrl={AVATAR}
//             name={author.name}
//             title={author.title}
//             handle={author.handle}
//             status={author.status}
//             contactText={author.contactText}
//             contactUrl={author.contactUrl}
//             innerGradient={author.innerGradient}
//             behindGlowColor={author.behindGlowColor}
//             behindGlowEnabled
//             enableTilt
//             showUserInfo
//           />
//         ))}
//       </div>
//     </section>
//   );
// }
