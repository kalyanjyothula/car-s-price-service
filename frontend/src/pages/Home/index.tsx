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

    console.log(missingFields, topSpeed, maxPower, maxTorque);

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
      const res: any = await axios.post(`${import.meta.env.VITE_ML_ENDPOINT}`, {
        ...payload,
      });

      if (res.status === 200) {
        const { selling_price } = res?.data || {};
        if (selling_price) setResult(selling_price);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" text-xl lg:text-3xl p-4 flex gap-4 flex-col bg-gray-200 h-screen">
      <div
        className=" shadow-input-card 
        border-gray-100 rounded-md border-2
        bg-white p-4"
      >
        <div className=" grid grid-cols-4 gap-4 py-4">
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
          <InputDropdown
            label="Model"
            selectLabel="Model"
            value={model}
            options={renderCarModels || ""}
            handleValueChange={handleModelChange}
          />
          <InputDropdown
            label="Gear Box"
            selectLabel="Gear Box"
            options={renderGearBox}
            value={gearBox}
            handleValueChange={setGearBox}
          />
          <InputDropdown
            label="Seats"
            selectLabel="Seats"
            options={renderSeats}
            value={seat}
            handleValueChange={setSeat}
          />
          <InputDropdown
            label="No of Cylinder"
            selectLabel="No of Cylinder"
            options={renderCylinder}
            value={cylinders}
            handleValueChange={setCylinders}
          />
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
        <Button className="cursor-pointer" onClick={handleCompute}>
          Compute
        </Button>
      </div>
      <div className="flex-1/2">
        {result && <CarPriceCelebration price={+result} />}
      </div>
    </div>
  );
}
