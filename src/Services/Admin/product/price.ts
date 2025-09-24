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
        console.log('Error in getting all quantities (service) =>', error);
    }
}

export const getProductPricesByProductId = async (productId: string) => {
    try {
        // Buscar preços por produto diretamente do endpoint específico
        const res = await fetch(`/api/Admin/productPrice/get-product-prices-by-id?id=${productId}`, {
            method: 'GET',
        });
        const data = await res.json();
        
        if (data.success) {
            // Filtrar apenas os preços do produto específico
            const productPrices = data.data.filter((price: any) => 
                price.product._id === productId || price.product === productId
            );
            return { success: true, data: productPrices };
        }
        return data;
    } catch (error) {
        console.log('Error in getting product prices by product ID (service) =>', error);
        return { success: false, message: 'Error fetching product prices' };
    }
}

