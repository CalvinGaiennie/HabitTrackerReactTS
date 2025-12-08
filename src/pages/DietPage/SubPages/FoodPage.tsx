import { useState, useEffect } from "react"
import fetchFoods from "../../../hooks/fetchFoods"
import type { Food } from "../../../types/foods"
import CreateFoodForm from "../../../components/CreateFoodForm"
import BootstrapModal from "../../../components/BootstrapModal"
function FoodPage() {
    const [foods, setFoods] = useState<Food[] | null>(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchFoods(setFoods)
    }, [])

    return (
        <div>
            <div className="d-flex gap-3 mb-3 justify-content-between align-items-center">
              <h3 className="mb-0">Food Library</h3>
              <button 
                  className="btn btn-primary px-4" 
                  onClick={() => setShowModal(true)}
              >
                  Add Food
              </button>
            </div>
            <BootstrapModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title={"Create Exercise"}
              >
                 <CreateFoodForm/>
              </BootstrapModal>
            {foods?.map((food) => (
                <div>
                    <h3>{food.name}</h3>
                    <p>Calories: {food.calories}</p>
                    <p>Protein: {food.protein_g}</p>
                    <p>Carbs: {food.carbs_g}</p>
                    <p>Fat: {food.fat_g}</p>
                    <p>{JSON.stringify(food)}</p>
                </div>
            ))}
        </div>
    )
}

export default FoodPage