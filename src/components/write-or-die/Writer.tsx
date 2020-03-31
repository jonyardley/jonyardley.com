import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { css } from "@emotion/core";
import randomWords from "random-words";
import ClientOnly from "../ClientOnly";
import Timer from "react-compound-timer";

const styles = {
  writer: css`
    width: 100%;
    background-color: transparent;
    border-color: #eee;
    border-width: 5px;
    padding: 20px;
    font-size: 22px;
  `,
  active: css`
    color: #0f0;
  `,
  difficulty: css`
    text-align: center;
    margin-top: 20px;
    background-color: #000;
    padding: 10px;
    margin-bottom: 20px;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  `,
  difficultyTitle: css`
    font-weight: 800;
  `,
  difficultyItem: css`
    display: inline;
    padding: 0 10px;
    cursor: pointer;
    font-weight: 300;
  `,
  inspiration: css`
    text-transform: uppercase;
    text-align: center;
  `,
  die: css`
    text-align: center;
    color: #f00 !important;
  `,
};

const IgnoredCharacters = [8, 46, 32, 13];

type TLevels = {
  [key: string]: number;
};

const Levels: TLevels = {
  Easy: 10000,
  Normal: 5000,
  Hard: 2000,
};

const DefaultLevel = "Normal";

const Writer: React.FC = () => {
  const [level, setLevel] = useState(DefaultLevel);
  const [count, setCount] = useState(Levels[DefaultLevel]);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [inspiration, setInspiration] = useState(randomWords(1));

  const handleKeyUp = (
    { keyCode }: React.KeyboardEvent,
    start: () => void
  ): void => {
    if (!hasStarted) {
      setHasStarted(true);
      start();
    }

    if (IgnoredCharacters.includes(keyCode)) {
      return;
    }
  };

  const moveCaretAtEnd = (e: any): void => {
    const { target } = e;
    const tempValue = target.value;
    setTimeout(() => {
      target.value = "";
      target.value = tempValue;
    }, 500);
  };

  const setDifficulty = (
    newLevel: string,
    setTime: (n: number) => void
  ): void => {
    if (!hasStarted) {
      setLevel(newLevel);
      setCount(Levels[newLevel]);
      setTime(Levels[newLevel]);
    }
  };

  return (
    <ClientOnly>
      <Timer
        initialTime={count}
        startImmediately={false}
        direction="backward"
        lastUnit="s"
        timeToUpdate={1}
        checkpoints={[
          {
            time: 0,
            callback: () => setHasEnded(true),
          },
        ]}
      >
        {({ start, setTime }: { start: () => void; setTime: () => void }) => (
          <div>
            <div css={styles.difficulty}>
              <div css={styles.difficultyTitle}>Difficulty</div>
              {Object.keys(Levels).map((key: string) => (
                <p
                  key={`difficulty-${key}`}
                  css={[
                    styles.difficultyItem,
                    key === level ? styles.active : "",
                  ]}
                  onClick={(): void => setDifficulty(key, setTime)}
                >
                  {key}
                </p>
              ))}
            </div>
            <p>
              Begin writing something around this suggestion.{" "}
              <a href="#" onClick={() => setInspiration(randomWords(1))}>
                Try another Suggestion...
              </a>
            </p>
            <h2 css={styles.inspiration}>{inspiration}</h2>
            {hasEnded && <h1 css={styles.die}>You Died!</h1>}
            <TextareaAutosize
              autoFocus
              css={styles.writer}
              defaultValue="Once upon a time..."
              disabled={hasEnded}
              onKeyUp={(e) => handleKeyUp(e, start)}
              onFocus={moveCaretAtEnd}
            />
            <p>
              Time left: <Timer.Seconds />:<Timer.Milliseconds />s
            </p>

            {hasEnded && (
              <p>
                <a href="#" onClick={() => window.location.reload()}>
                  Write another one.
                </a>{" "}
                Go on, you know you want to.
              </p>
            )}
            {!hasEnded && (
              <a href="#" onClick={() => window.location.reload()}>
                Argh! Reset and try again
              </a>
            )}
          </div>
        )}
      </Timer>
    </ClientOnly>
  );
};

export default Writer;
