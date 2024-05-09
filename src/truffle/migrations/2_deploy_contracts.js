// migrations/2_deploy_contracts.js
const Message = artifacts.require("Message");

module.exports = function (deployer) {
  deployer.deploy(Message);
};
