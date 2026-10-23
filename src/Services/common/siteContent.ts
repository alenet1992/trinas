import Cookies from "js-cookie";
import { SiteContentData } from "@/utils/siteContentDefaults";


export const get_site_content = async () => {
  try {
    const res = await fetch('/api/common/site-content', {
      method: 'GET',
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in getting site content (service) =>', error)
  }
}


export const update_site_content = async (content: SiteContentData) => {
  try {
    const res = await fetch('/api/Admin/site-content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      body: JSON.stringify(content),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in updating site content (service) =>', error)
  }
}
