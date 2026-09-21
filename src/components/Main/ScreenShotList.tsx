import Image from "next/image";

const screenshots = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  src: "/images/game-screenshots/demo_image.webp",
  alt: `Пример скриншота из игры ${index + 1}`,
}));

export default function ScreenShotList() {
  return (
    <section id="screenshots" className="w-full scroll-mt-20">
      <h1 className="mb-6 text-2xl font-semibold">Screenshots</h1>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {screenshots.map((screenshot) => (
          <li
            key={screenshot.id}
            className="group relative aspect-video overflow-hidden rounded-xl bg-muted"
          >
            <Image
              src={screenshot.src}
              alt={screenshot.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
