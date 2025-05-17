const CarFeatures = () => {
  const features = [
    "myear",
    "oem",
    "model",
    "gear_box",
    "seats",
    "steering type",
    "no of cylinder",
    "super charger",
    "top speed",
    "max power delivered",
    "max torque delivered",
    "feature score",
  ];

  return (
    <div className="max-w-md p-6 bg-white rounded-2xl ">
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {features.map((feature, index) => (
          <li key={index} className="capitalize">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarFeatures;
