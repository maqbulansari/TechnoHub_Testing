import { useEffect, useMemo, useState } from "react";

export default function AnimatedWord({
  words = [],
  typingSpeed = 150,
  deletingSpeed = 100,
  delayBetweenWords = 1000,
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // longest word for width locking
  const longestWord = useMemo(() => {
    return words.reduce(
      (longest, w) => (w.length > longest.length ? w : longest),
      ""
    );
  }, [words]);

  useEffect(() => {
    if (!words.length) return;

    const currentWord = words[currentWordIndex];
    let timer;

    if (!deleting && displayedText.length < currentWord.length) {
      timer = setTimeout(() => {
        setDisplayedText(
          currentWord.slice(0, displayedText.length + 1)
        );
      }, typingSpeed);
    } else if (deleting && displayedText.length > 0) {
      timer = setTimeout(() => {
        setDisplayedText(
          currentWord.slice(0, displayedText.length - 1)
        );
      }, deletingSpeed);
    } else if (!deleting && displayedText.length === currentWord.length) {
      timer = setTimeout(() => setDeleting(true), delayBetweenWords);
    } else if (deleting && displayedText.length === 0) {
      setDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [
    displayedText,
    deleting,
    currentWordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    delayBetweenWords,
  ]);

  return (
    <span className="relative inline-block">
      {/* Invisible width lock */}
      <span className="invisible whitespace-nowrap">
        {longestWord}
      </span>

      {/* Animated text */}
      <span
        aria-live="polite"
        aria-atomic="true"
        className="
          absolute left-0 top-0
          inline-flex items-center
          whitespace-nowrap
          motion-reduce:after:hidden
          after:content-['']
          after:ml-1
          after:inline-block
          after:w-px
          after:h-[1em]
          after:bg-current
          after:animate-caret
        "
      >
        {displayedText}
      </span>
    </span>
  );
}
