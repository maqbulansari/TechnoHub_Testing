export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text">
        {title}</h2>
      {subtitle && (
        <p className="mt-4 text-muted text-base sm:text-lg">
          {subtitle}</p>
      )}
    </div>
  );
}
