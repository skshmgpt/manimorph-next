import styles from "@components/BlockLoader.module.scss";
import { useEffect, useRef, useState } from "react";

const SEQUENCES = [["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"]];

interface BlockLoaderProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  mode?: number;
}

const BlockLoader = ({ mode = 0 }: BlockLoaderProps) => {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const indexLength = SEQUENCES[mode].length;

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % indexLength);
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [indexLength]);

  return <span className={styles.root}>{SEQUENCES[mode][index]}</span>;
};

export default BlockLoader;
