# CRM
Deployed at - https://crm-software-kartik.herokuapp.com/

A. User Creation

	{
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		userType: "",
		currUserRole: "admin/manager/employee/x"
	}

	1. Only the manager/admin can create a new 'employee'.
	2. Only 1 admin can exist which is the deafult user.
	3. Only admin can create new managers.
	4. Must have all 6 fields in request.
	5. Password is encrypted.

B. Login

	{
		email: "",
		password: "",
		currUserRole: "admin/manager/employee/x"	
	}

	1. Only registered users can login.
	2. On login, a cookie will be generated.
	3. Password is authenticated.
	4. All 3 fields must be present.

C. Leads
	{
		subject: "",
		assignedTo: "",
		stage: "",
		id: 0,
		createdBy: "",
		currUserRole: "admin/manager/employee/x"
	}

	1. Create leads with unique IDs.
	2. Assign leads to employee in request.
	3. Leads can only be created by admin/manager/employee.
	4. Leads can be viewed by all employees.
	5. All 5 fields must be present.
	6. Update multiple fields of a lead in a request.
	7. Get a lead by ID.
	8. Get all leads.
D. Services
	{
		subject: "",
		assignedTo: "",
		stage: "",
		id: 0,
		createdBy: "",
		currUserRole: "admin/manager/employee/x"
	}

	1. Create services with unique IDs.
	2. Assign services to employee in request.
	3. Leads can only be created by admin/manager/employee.
	4. Leads can be viewed by all employees.
	5. All 5 fields must be present.
	6. Update multiple fields of a service in a request.
	7. Get a service by ID.
	8. Get all services.