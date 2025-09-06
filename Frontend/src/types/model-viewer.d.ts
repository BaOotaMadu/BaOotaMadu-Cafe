declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<ModelViewerAttributes, HTMLElement>;
    }
  }

  interface ModelViewerElement extends HTMLElement {
    activateAR: () => Promise<void>;
    resetTurntableRotation: () => void;
    canActivateAR: boolean;
  }
}

interface ModelViewerAttributes extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  alt?: string;
  ar?: boolean;
  'ar-modes'?: string;
  'ar-scale'?: string;
  'ios-src'?: string;
  'camera-controls'?: boolean;
  'auto-rotate'?: boolean;
  'shadow-intensity'?: string | number;
  'environment-image'?: string;
  poster?: string;
  'camera-orbit'?: string;
  'field-of-view'?: string;
  'min-camera-orbit'?: string;
  'max-camera-orbit'?: string;
  style?: React.CSSProperties;
}

export {};