import React from "react";
import { Composition, registerRoot } from "remotion";
import {
  PostMotionKoreanLoopEnglishLongform15,
  defaultEnglishLongformProps,
} from "./PostMotionKoreanLoopEnglishLongform15";

const KoreanGrammarRoot: React.FC = () => {
  return (
    <Composition
      id="KoreanLoopLongformEN-Phrases15"
      component={PostMotionKoreanLoopEnglishLongform15 as unknown as React.ComponentType<Record<string, unknown>>}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={defaultEnglishLongformProps as unknown as Record<string, unknown>}
      calculateMetadata={({ props }) => ({
        durationInFrames: Number((props as { totalFrames?: number }).totalFrames) || 900,
      })}
    />
  );
};

registerRoot(KoreanGrammarRoot);
