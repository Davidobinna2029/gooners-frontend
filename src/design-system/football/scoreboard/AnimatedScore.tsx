"use client";

import {
  useEffect,
  useState,
} from "react";

interface Props {

  value: number;

}

export default function AnimatedScore({

  value,

}: Props) {

  const [

    display,

    setDisplay,

  ] = useState(value);

  const [

    animate,

    setAnimate,

  ] = useState(false);

  useEffect(() => {

    if (value === display) {

      return;

    }

    setAnimate(true);

    const timer = setTimeout(() => {

      setDisplay(value);

      setAnimate(false);

    }, 180);

    return () => clearTimeout(timer);

  }, [

    value,

    display,

  ]);

  return (

    <span

      className={`
        inline-block
        transition-all
        duration-200

        ${
          animate
            ? "scale-125 text-red-500"
            : "scale-100"
        }
      `}

    >

      {display}

    </span>

  );

}