# BigBites

The BigBites is a full-stack project designed to enhance the food ordering experience for customers. It offers a variety of features, including the ability to browse the menu, choose between delivery and pickup options, access exclusive promotions, and much more.

## Website Admin Features

- **Order Notifications:** When an order is placed by a customer, the website will receive a notification.
- **Dashboard:** This section displays an overview of today's activity as well as data from the past five months.
- **Orders Management:** View orders categorized as Pending, Pending Advance, Completed, or Canceled. The admin can update the status of orders to Completed or Canceled.
- **Menu, Branches, and Promos:** Admins can dynamically customize these elements for customers to view.
- **User Management:** Admins can add, edit, or delete users. Different types of admin roles are available: Administrator, Manager, and Staff.
- **Reports:** Admins can generate printable files for the Branch List, Branch Earnings, and Overview reports.
- **User Settings:** Users can update their information in this section.

## Client Mobile Application Features:

- **Orders:**  
  This outlines the steps involved in the order process:  
   > *Pickup / Delivery → Dine In / Takeout / User Location → Choose Menu Items → View Cart → Checkout → Payment Information → Verify Payment → View Receipt*
- **Additional Fees:** Delivery fees and discount deductions may apply, depending on the order.
- **Advance Orders:** Customers can place orders in advance when the branch is available for advance orders. They can select the date and time for their order.
- **User Location:** This feature utilizes OpenStreetMap, allowing users to search for their location, drag the pinned location, and detect their current location.
- **View Menu:** The user can view and add menu items to their cart, customize the quantity, choose add-ons, and mark menu items as favorites.
- **Paymongo:**  Users can pay for their orders using various payment methods. *(This section is currently using a Test API.)*
- **Receipt:** Once the user successfully places an order, the app generates a reference number, order number, and other important details. Users can also download the receipt to their phone.


## Role Permissions Table

| Permission            | Administrator | Manager | Staff | Customer |
|-----------------------|:-------------:|:-------:|:-----:|:--------:|
| view-role             | ✅            | ✅      | ✅    | ❌       |
| create-role           | ✅            | ❌      | ❌    | ❌       |
| edit-role             | ✅            | ❌      | ❌    | ❌       |
| delete-role           | ✅            | ❌      | ❌    | ❌       |
| view-admin-user       | ✅            | ✅      | ✅    | ❌       |
| create-admin-user     | ✅            | ✅      | ❌    | ❌       |
| edit-admin-user       | ✅            | ✅      | ❌    | ❌       |
| delete-admin-user     | ✅            | ✅      | ❌    | ❌       |
| view-branch           | ✅            | ✅      | ✅    | ✅       |
| create-branch         | ✅            | ❌      | ❌    | ❌       |
| edit-branch           | ✅            | ❌      | ❌    | ❌       |
| delete-branch         | ✅            | ❌      | ❌    | ❌       |
| view-promo            | ✅            | ✅      | ✅    | ✅       |
| create-promo          | ✅            | ❌      | ❌    | ❌       |
| edit-promo            | ✅            | ❌      | ❌    | ❌       |
| delete-promo          | ✅            | ❌      | ❌    | ❌       |
| view-menu             | ✅            | ✅      | ✅    | ✅       |
| create-menu           | ✅            | ❌      | ❌    | ❌       |
| edit-menu             | ✅            | ❌      | ❌    | ❌       |
| delete-menu           | ✅            | ❌      | ❌    | ❌       |
| view-client-user      | ✅            | ✅      | ✅    | ✅       |
| create-client-user    | ✅            | ❌      | ❌    | ✅       |
| edit-client-user      | ✅            | ❌      | ❌    | ✅       |
| delete-client-user    | ✅            | ❌      | ❌    | ✅       |
| view-order            | ✅            | ✅      | ✅    | ✅       |
| create-order          | ✅            | ❌      | ❌    | ✅       |
| edit-order            | ✅            | ✅      | ✅    | ✅       |
| delete-order          | ✅            | ✅      | ❌    | ✅       |


> ### ⚠️ Developer Note:
> This is a personal project currently hosted on a free hosting platform.  
> The website and mobile app are still in the development stage, meaning there is significant room for enhancement and refinement.
