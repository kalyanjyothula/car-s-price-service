import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface imageProps {
  src: any;
}

const ZoomableImage = (props: imageProps) => {
  const { src } = props;
  return (
    <div style={{ width: "100%", height: "100%", border: "1px solid #ccc" }}>
      <TransformWrapper
        initialScale={1}
        wheel={{ step: 0.2 }}
        doubleClick={{ disabled: false }}
        pinch={{ disabled: false }}
        panning={{ disabled: false }}
      >
        <TransformComponent>
          <img
            src={src}
            alt="Zoomable"
            style={{ width: "100%", height: "auto" }}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default ZoomableImage;
