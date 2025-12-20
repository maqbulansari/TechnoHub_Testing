export default function SectionHeading({ title, subtitle, children }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text">
        {title}

        {/* Animated word */}
        <span className="block sm:inline-block sm:ml-2">
          {children}
        </span>
      </h2>

      {subtitle && (
        <p className="mt-4 text-muted text-base sm:text-md">
          {subtitle}
        </p>
      )}
    </div>
  );
}
