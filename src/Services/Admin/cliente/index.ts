

import Cookies from "js-cookie";


export const add_new_client = async (formData: any) => {
  try {
    const res = await fetch(`/api/common/client/add-client`, {
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


export const delete_a_client = async (id: string) => {
  try {
    const res = await fetch(`/api/common/client/delete-client?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
    })

    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in deleting Product (service) =>', error)
  }
}