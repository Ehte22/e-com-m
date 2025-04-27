import { validationRulesSchema } from "../utils/validator";

export const productRules: validationRulesSchema = {
    name: { required: true },
    price: { required: true },
    desc: { required: true },
    category: { required: true },
    image: { required: true },
} 