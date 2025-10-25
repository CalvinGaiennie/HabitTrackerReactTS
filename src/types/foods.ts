export interface Food {
    id: number;
    name: string;
    serving_size_ammount: string;
    serving_size_unit: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
};

export interface FoodCreate {
    name: string;
    serving_size_ammount: string;
    serving_size_unit: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
};