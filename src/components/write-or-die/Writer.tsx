import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { css } from '@emotion/core';

const styles = {
  writer: css`
    width: 100%;
    background-color: transparent;
    border-color:#eee;
    border-width: 5px;
    font-size: calc(10px + 2vmin);
    margin-bottom: 20px;
    padding: 10px;
    `,
  active: css`
    color: #0f0;
    `,
  difficulty: css`
    text-align: center;  
    margin-top: 20px;
    font-size: calc(10px + .8vmin);
    background-color: #000;
    padding: 10px;
    color: #fff;
    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;
    `,
  difficultyTitle: css`
    font-weight: 800;
    padding-bottom: 0px;
    `,
  difficultyItem: css`
    display:inline;
    padding: 0 10px;
    cursor: pointer;
    font-weight: 300;
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
    setTimeout(() => {
      const tempValue = e.target.value;
      e.target.value = '';
      e.target.value = tempValue;
    }, 1);
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
        <div
          css={[styles.difficultyItem, level === 'Easy' ? styles.active : '']}
          onClick={(): void => setDifficulty('Easy')}
        >
          Easy (10s)
        </div>
        <div
          css={[styles.difficultyItem, level === 'Normal' ? styles.active : '']}
          onClick={(): void => setDifficulty('Normal')}
        >
          Normal (5s)
        </div>
        <p
          css={[styles.difficultyItem, level === 'Hard' ? styles.active : '']}
          onClick={(): void => setDifficulty('Hard')}
        >
          Hard (2s)
        </p>
      </div>
      {hasStarted && <p>Seconds left: {Number(count).toFixed(2)}</p>}
      {!hasStarted && <p>Begin writing something...</p>}
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
