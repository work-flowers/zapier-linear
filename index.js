const authentication = require('./authentication');
const createChildLabelCreate = require('./creates/create_child_label.js');
const listIssueCommentsSearch = require('./searches/list_issue_comments.js');
const issueLabelSearch = require('./searches/issue_label.js');
const setProjectTargetCreate = require('./creates/set_project_target.js');
const createProjectAttachmentCreate = require('./creates/create_project_attachment.js');
const updateIssueAttachmentTitleCreate = require('./creates/update_issue_attachment_title.js');
const createTeamCreate = require('./creates/create_team.js');
const createChildCommentCreate = require('./creates/create_child_comment.js');
const createEmojiCreate = require('./creates/create_emoji.js');
const retrieveStateSearch = require('./searches/retrieve_state.js');
const retrieveIssueDetailsSearch = require('./searches/retrieve_team.js');
const newTeamTrigger = require('./triggers/new_team.js');

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
  },
  creates: {
    [createChildLabelCreate.key]: createChildLabelCreate,
    [setProjectTargetCreate.key]: setProjectTargetCreate,
    [createProjectAttachmentCreate.key]: createProjectAttachmentCreate,
    [updateIssueAttachmentTitleCreate.key]: updateIssueAttachmentTitleCreate,
    [createTeamCreate.key]: createTeamCreate,
    [createChildCommentCreate.key]: createChildCommentCreate,
    [createEmojiCreate.key]: createEmojiCreate,
  },
  searches: {
    [retrieveStateSearch.key]: retrieveStateSearch,
    [retrieveIssueDetailsSearch.key]: retrieveIssueDetailsSearch,
    [listIssueCommentsSearch.key]: listIssueCommentsSearch,
    [issueLabelSearch.key]: issueLabelSearch,
  },
};
