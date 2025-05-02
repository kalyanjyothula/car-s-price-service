from pydantic import BaseModel

class CarsInput(BaseModel):
        myear: int
        oem: str
        model: str
        gear_box: str
        seats: int
        steering_type: str
        no_of_cylinder: int
        super_charger: int
        top_speed: int
        max_power_delivered: float
        max_torque_delivered: float
        feature_score: int