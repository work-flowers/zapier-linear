const authentication = require('./authentication');
const createChildLabelCreate = require('./creates/create_child_label.js');
const listIssueCommentsSearch = require('./searches/list_issue_comments.js');
const setProjectTargetCreate = require('./creates/set_project_target.js');
const createProjectAttachmentCreate = require('./creates/create_project_attachment.js');
const updateIssueAttachmentTitleCreate = require('./creates/update_issue_attachment_title.js');
const createTeamCreate = require('./creates/create_team.js');
const createChildCommentCreate = require('./creates/create_child_comment.js');
const createEmojiCreate = require('./creates/create_emoji.js');
const suspendUserCreate = require('./creates/suspend_user.js');
const retrieveStateSearch = require('./searches/retrieve_state.js');
const retrieveIssueDetailsSearch = require('./searches/retrieve_issue_details.js');
const newTeamTrigger = require('./triggers/new_team.js');
const teamRetirementStatusChangedTrigger = require('./triggers/team_retirement_status_changed.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  requestTemplate: {
    params: { api_key: '{{bundle.authData.api_key}}' },
    headers: { 'X-API-KEY': '{{bundle.authData.api_key}}' },
  },
  triggers: {
    [newTeamTrigger.key]: newTeamTrigger,
    [teamRetirementStatusChangedTrigger.key]: teamRetirementStatusChangedTrigger,
  },
  creates: {
    [createChildLabelCreate.key]: createChildLabelCreate,
    [setProjectTargetCreate.key]: setProjectTargetCreate,
    [createProjectAttachmentCreate.key]: createProjectAttachmentCreate,
    [updateIssueAttachmentTitleCreate.key]: updateIssueAttachmentTitleCreate,
    [createTeamCreate.key]: createTeamCreate,
    [createChildCommentCreate.key]: createChildCommentCreate,
    [createEmojiCreate.key]: createEmojiCreate,
    [suspendUserCreate.key]: suspendUserCreate,
  },
  searches: {
    [retrieveStateSearch.key]: retrieveStateSearch,
    [retrieveIssueDetailsSearch.key]: retrieveIssueDetailsSearch,
    [listIssueCommentsSearch.key]: listIssueCommentsSearch,
  },
};
