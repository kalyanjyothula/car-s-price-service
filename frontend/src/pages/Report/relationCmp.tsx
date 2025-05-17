import ZoomableImage from "@/components/ui/ZoomableImage ";
import plotImg from "../../assets/my_plot.png";
import CarFeatures from "./carFeatures";

export default function RelationCmp() {
  return (
    <div className="p-y px-6 ">
      <p className="py-4 text-2xl font-bold underline">Relationship Analysis</p>
      <div>
        <ZoomableImage src={plotImg} />
      </div>
      <p className="py-2 text-xl font-bold text-left">Summary :</p>
      <div className="text-left">
        The following feature shows a strong correlation with the car's selling
        price,
        <CarFeatures />
      </div>
    </div>
  );
}
