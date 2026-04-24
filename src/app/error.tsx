"use client";

import { useEffect } from "react";
import { ErrorFallbackUI } from "@/components/shared/error-fallback-ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorFallbackUI
      layout="embedded"
      kicker="Something went wrong"
      title="We could not load this page"
      description="A temporary error occurred. You can try again, go home, or open the publications library."
      digest={error.digest}
      onReset={() => reset()}
    />
  );
}
