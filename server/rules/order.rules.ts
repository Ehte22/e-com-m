import { validationRulesSchema } from "../utils/validator";

export const orderRules: validationRulesSchema = {
    shippingDetails: {
        object: true,
        fullName: { required: true },
        address: { required: true },
        city: { required: true },
        state: { required: true },
        zipCode: { required: true }
    },
    totalAmount: { required: true, type: "number" },
    paymentMethod: { required: true }
} 