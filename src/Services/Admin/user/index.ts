import Cookies from "js-cookie";


export const get_all_users = async () => {
  try {
    const res = await fetch('/api/Admin/user/get-all-users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in getting all users (service) =>', error)
  }
}


export const update_a_user = async (formData: any) => {
  try {
    const res = await fetch('/api/Admin/user/update-user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in updating user (service) =>', error)
  }
}


export const delete_a_user = async (id: string) => {
  try {
    const res = await fetch(`/api/Admin/user/delete-user?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in deleting user (service) =>', error)
  }
}
