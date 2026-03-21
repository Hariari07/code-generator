const service = require("./userProfile.service");

async function getPaginateduserProfile(req, res) {
  try {
    const { page=0, size=10, sortField="", sortOrder=1, filters={} } = req.body;
    const result = await service.getPaginateduserProfile(page, size, sortField, sortOrder, filters);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllPlainuserProfile(req, res) {
  const data = await service.readAllPlainuserProfile();
  res.json({ data });
}

async function getByIduserProfile(req, res) {
  const data = await service.readByIduserProfile(req.body.id);
  res.json({ data });
}

async function createuserProfile(req, res) {  
   try {
    const reqBody = req.body;
    const { data } = reqBody;
    const parsedData = JSON.parse(data);

    const check = await service.checkExistsDatauserProfile(parsedData.employeeCode);

    if (check) {
      return res.status(600).json({ error: "Employee Already Exists!" });
    } else {
      const id = await service.createuserProfile(req.body, req.file);
      res.status(201).json({ message: "success" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

async function updateuserProfile(req, res) {
  await service.modifyuserProfile(req.body.id, req.body);
  res.json({ message: "success" });
}

async function getRefNouserProfile(req, res) {
  const nextNo = await service.getNextRefNouserProfile();
  res.json({ nextNo });
}

module.exports = {
  getPaginateduserProfile,
  getAllPlainuserProfile,
  getByIduserProfile,
  createuserProfile,
  updateuserProfile,
  getRefNouserProfile
};
