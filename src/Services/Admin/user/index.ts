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
