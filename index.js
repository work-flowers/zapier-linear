const authentication = require('./authentication');
const listIssueCommentsCreate = require('./creates/list_issue_comments.js');
const issueLabelCreate = require('./creates/issue_label.js');
const createChildLabelCreate = require('./creates/create_child_label.js');
const setProjectTargetCreate = require('./creates/set_project_target.js');
const createProjectAttachmentCreate = require('./creates/create_project_attachment.js');
const updateIssueAttachmentTitleCreate = require('./creates/update_issue_attachment_title.js');
const createTeamCreate = require('./creates/create_team.js');
const createChildCommentCreate = require('./creates/create_child_comment.js');
const createEmojiCreate = require('./creates/create_emoji.js');
const retrieveStateSearch = require('./searches/retrieve_state.js');
const retrieveTeamSearch = require('./searches/retrieve_team.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  requestTemplate: {
    params: { api_key: '{{bundle.authData.api_key}}' },
    headers: { 'X-API-KEY': '{{bundle.authData.api_key}}' },
  },
  creates: {
    [listIssueCommentsCreate.key]: listIssueCommentsCreate,
    [issueLabelCreate.key]: issueLabelCreate,
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
    [retrieveTeamSearch.key]: retrieveTeamSearch,
  },
};
