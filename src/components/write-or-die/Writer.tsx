import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { css } from '@emotion/core';
import randomWords from 'random-words';

const styles = {
  writer: css`
    width: 100%;
    background-color: transparent;
    border-color:#eee;
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
    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;
    `,
  difficultyTitle: css`
    font-weight: 800;
    `,
  difficultyItem: css`
    display:inline;
    padding: 0 10px;
    cursor: pointer;
    font-weight: 300;
    `,
  inspiration: css`
    text-transform: uppercase;
  `,
};

const IgnoredCharacters = [8, 46, 32, 13];

type TLevels = {
  [key: string]: number;
};

const Levels: TLevels = {
  Easy: 10,
  Normal: 5,
  Hard: 2,
};

const DefaultLevel = 'Normal';

const Writer: React.FC = () => {
  const [level, setLevel] = useState(DefaultLevel);
  const [count, setCount] = useState(Levels[DefaultLevel]);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [inspiration, setInspiration] = useState(randomWords(1));

  useEffect(() => {
    const interval = setInterval(() => {
      const newCount = Math.round((count - 0.01) * 100) / 100;

      if (newCount === 0) {
        setHasEnded(true);
      }

      if (hasStarted && !hasEnded) {
        setCount(newCount);
      }
    }, 10);
    return (): void => clearInterval(interval);
  }, [count, setCount, hasStarted, hasEnded, setHasEnded]);

  const handleKeyUp = ({ keyCode }: React.KeyboardEvent): void => {
    if (!hasStarted) {
      setHasStarted(true);
      setCount(Levels[level]);
    }

    if (IgnoredCharacters.includes(keyCode)) {
      return;
    }

    setCount(Levels[level]);
  };

  const moveCaretAtEnd = (e: any): void => {
    const { target } = e;
    const tempValue = target.value;
    setTimeout(() => {
      target.value = '';
      target.value = tempValue;
    }, 500);
  };

  const setDifficulty = (newLevel: string): void => {
    if (!hasStarted) {
      setLevel(newLevel);
      setCount(Levels[level]);
    }
  };

  return (
    <div>
      <div css={styles.difficulty}>
        <div css={styles.difficultyTitle}>Difficulty</div>
        {Object.keys(Levels).map(((key: string) => (
          <p
            key={`difficulty-${key}`}
            css={[styles.difficultyItem, key === level ? styles.active : '']}
            onClick={(): void => setDifficulty(key)}
          >
            {key}
          </p>
        )))}
      </div>
      {hasStarted && <p>Seconds left: {Number(count).toFixed(2)}</p>}
      {!hasStarted && <p>Begin writing something around the word <strong css={styles.inspiration}>{inspiration}</strong>. <a href="#" onClick={() => setInspiration(randomWords(1))}>Try another Suggestion...</a></p>}
      {hasEnded && <h1>DIE!</h1>}
      {hasEnded && <p>Why not share your story on the social medias?</p>}
      <TextareaAutosize
        autoFocus
        css={styles.writer}
        defaultValue="Once upon a time..."
        disabled={hasEnded}
        onKeyUp={handleKeyUp}
        onFocus={moveCaretAtEnd}
      />

      {hasEnded && (
        <p>
          <a href="#" onClick={() => window.location.reload()}>
            Write another one.
          </a>{' '}
          Go on, you know you want to.
        </p>
      )}
      {!hasEnded && (<a href="#" onClick={() => window.location.reload()}>Argh! Reset and try again</a>)}
    </div>
  );
};

export default Writer;
