

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