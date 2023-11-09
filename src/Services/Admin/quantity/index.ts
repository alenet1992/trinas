

import Cookies from "js-cookie";


export const GetAllQuantity = async () => {
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

export const AddNewQuantity = async (formData: any) => {
  try {
    const res = await fetch(`/api/Admin/quantity/add-quantity`, {
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
    console.log('Error in Add New Category (service) =>', error);
  }
}

export const DeleteQuantity = async (id: string) => {
  try {
    const res = await fetch(`/api/Admin/quantity/delete-quantity?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
    })

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in deleting Categories (service) =>', error)
  }
}


export const UpdateQuantity = async (formData: any) => {
  try {
    const res = await fetch(`/api/Admin/quantity/update-quantity`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in updating Categories (service) =>', error)
  }
}




