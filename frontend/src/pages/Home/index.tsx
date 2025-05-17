import axios from "axios";
import { Button } from "@/components/ui/button";
import InputDropdown from "@/components/ui/inputDropdown";
import { InputRadioGroup } from "@/components/ui/inputRadioGroup";
import InputSlider from "@/components/ui/inputSlider";
import MultiSelectDropdown from "@/components/ui/multiSelect";
import {
  YearsList,
  carBrands,
  carModels,
  steeringType,
  superCharger,
  features,
  featureWeight,
  seatsByGroup,
  gearBoxGroup,
  cylinderGroup,
} from "./constants";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import CarPriceCelebration from "@/components/ui/CarPriceCelebration";

export default function Home() {
  const [year, setYear] = useState("");
  const [company, setCompany] = useState("");
  const [model, setModel] = useState("");
  const [gearBox, setGearBox] = useState("");
  const [seat, setSeat] = useState("");
  const [cylinders, setCylinders] = useState("");
  const [steering, setSteering] = useState("");
  const [superCharge, setSuperCharge] = useState("");
  const [maxPower, setMaxPower] = useState<number[]>([]);
  const [maxTorque, setMaxTorque] = useState<number[]>([]);
  const [topSpeed, setTopSpeed] = useState<number[]>([]);
  const [selectedFeatuers, setSelectedFeatures] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState("");

  const renderCarModels = useMemo(() => carModels[company], [company]);

  const renderSeats = useMemo(() => {
    const st = [];
    for (const [key, value] of Object.entries(seatsByGroup)) {
      if (value.includes(model)) st.push({ label: `${key}`, value: `${key}` });
    }
    return st;
  }, [model]);

  const renderGearBox = useMemo(() => {
    const st = [];
    for (const [key, value] of Object.entries(gearBoxGroup)) {
      if (value.includes(model)) st.push({ label: `${key}`, value: `${key}` });
    }
    return st;
  }, [model]);

  const renderCylinder = useMemo(() => {
    const st = [];
    for (const [key, value] of Object.entries(cylinderGroup)) {
      if (value.includes(model)) st.push({ label: `${key}`, value: `${key}` });
    }
    return st;
  }, [model]);

  const handleModelChange = (val: any) => {
    setSeat("");
    setGearBox("");
    setCylinders("");
    setModel(val);
  };

  const handleCompany = (val: any) => {
    setSeat("");
    setGearBox("");
    setCylinders("");
    setModel("");
    setCompany(val);
  };

  const handleCompute = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const featuresScore = selectedFeatuers.reduce(
      (score: number, itm: string): number => {
        return score + (featureWeight as Record<string, number>)[itm];
      },
      0
    );

    const requiredFields = {
      year,
      company,
      model,
      gearBox,
      seat,
      steering,
      cylinders,
      superCharge,
    };

    const missingFields = Object.entries(requiredFields).filter(
      ([, value]) => !value
    );

    // console.log(missingFields, topSpeed, maxPower, maxTorque);

    if (
      missingFields.length > 0 ||
      !topSpeed.length ||
      !maxPower.length ||
      !maxTorque.length
    ) {
      toast.error("Missing input: Please fill in all required fields.");
      return;
    }

    const payload = {
      myear: +year,
      oem: company,
      model: model,
      gear_box: gearBox,
      seats: +seat,
      steering_type: steering,
      no_of_cylinder: +cylinders,
      super_charger: +superCharge,
      top_speed: topSpeed?.[0] || "",
      max_power_delivered: maxPower?.[0] || "",
      max_torque_delivered: maxTorque?.[0] || "",
      feature_score: +featuresScore,
    };

    try {
      setLoading(true);
      const res: any = await axios.post(`${import.meta.env.VITE_ML_ENDPOINT}`, {
        ...payload,
      });

      if (res.status === 200) {
        const { selling_price } = res?.data || {};
        if (selling_price) setResult(selling_price);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className=" text-xl lg:text-3xl p-4 grid  grid-cols-3 gap-4 bg-gray-200 h-full">
      <div
        className=" shadow-input-card border-gray-100 rounded-md border-2
        bg-white p-4"
      >
        <div className=" flex flex-col gap-4 py-4 max-h-[386px] overflow-y-scroll">
          <InputDropdown
            label="Purchase Year"
            selectLabel="Year"
            options={YearsList}
            value={year}
            handleValueChange={setYear}
          />
          <InputDropdown
            label="Company"
            selectLabel="Company"
            options={carBrands}
            value={company}
            handleValueChange={handleCompany}
          />
          {company && (
            <InputDropdown
              label="Model"
              selectLabel="Model"
              value={model}
              options={renderCarModels || ""}
              handleValueChange={handleModelChange}
            />
          )}
          {company && model && (
            <InputDropdown
              label="Gear Box"
              selectLabel="Gear Box"
              options={renderGearBox}
              value={gearBox}
              handleValueChange={setGearBox}
            />
          )}
          {company && model && (
            <InputDropdown
              label="Seats"
              selectLabel="Seats"
              options={renderSeats}
              value={seat}
              handleValueChange={setSeat}
            />
          )}
          {company && model && (
            <InputDropdown
              label="No of Cylinder"
              selectLabel="No of Cylinder"
              options={renderCylinder}
              value={cylinders}
              handleValueChange={setCylinders}
            />
          )}
          <InputRadioGroup
            label="Steering Type"
            radioGroup={steeringType}
            handleValueChange={setSteering}
          />

          <InputRadioGroup
            label="Super Charger"
            radioGroup={superCharger}
            handleValueChange={setSuperCharge}
          />
          <InputSlider
            label="Top Speed"
            min={80}
            max={280}
            value={topSpeed}
            handleValueChange={setTopSpeed}
          />
          <InputSlider
            label="Max Power Delivered"
            min={40}
            max={160}
            step={0.1}
            value={maxPower}
            handleValueChange={setMaxPower}
          />
          <InputSlider
            label="Max Torque Delivered"
            min={40}
            max={160}
            step={0.1}
            value={maxTorque}
            handleValueChange={setMaxTorque}
          />
          <MultiSelectDropdown
            label="Features"
            options={features}
            selected={selectedFeatuers}
            setSelected={setSelectedFeatures}
          />
        </div>
        <Button
          className="cursor-pointer mt-6"
          onClick={handleCompute}
          disabled={loading}
        >
          {loading ? "Computing ..." : "Compute"}
        </Button>
      </div>
      <div className="col-span-2">
        {result && <CarPriceCelebration price={+result} />}
      </div>
    </div>
  );
}
