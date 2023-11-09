import Cookies from "js-cookie";

export const newProductPrice = async (formData: any) => {
    try {
        const res = await fetch(`/api/Admin/productPrice/add-product-price`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('Error in adding price (service) =>', error);
    }
}

export const GetProductPriceById = async () => {
    try {
        const res = await fetch('/api/Admin/quantity/get-all-quantity', {
            method: 'GET',
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('Error in getting all Categories (service) =>', error)
    }
}

