const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentByThreadHandler = this.postCommentByThreadHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
  }

  async postCommentByThreadHandler(req, res) {
    const { id: owner } = req.auth.credentials;
    const { threadId } = req.params;
    const addCommentUseCase = await this._container.getInstance(AddCommentUseCase.name);

    const addedComment = await addCommentUseCase.execute(req.payload, { owner, threadId });

    const response = res.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(req, res) {
    const { id: owner } = req.auth.credentials;
    const { threadId, commentId } = req.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    await deleteCommentUseCase.execute({ commentId, threadId, owner });

    const response = res.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;