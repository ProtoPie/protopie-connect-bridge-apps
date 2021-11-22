export type GestureQueue = string[];

export type Messages = { [messageId: string]: string | number };

interface AccumulatorFormat {
  xyRatio: { x: number; y: number };
  fingerTipPosition: { x: number; y: number };
  brightness: number;
  gestures: {
    name: string;
    confidence: number;
  }[];
  gestureQueue: GestureQueue;
  prev: Partial<Omit<AccumulatorFormat, 'prev'>>;
  messages: Messages;
}

export type Accumulator = Partial<AccumulatorFormat>;
