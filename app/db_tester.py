from models.comments import Comment

def read_children():
    comment = Comment.query.get(1)

    dictionary = comment.to_dict()
    print(dictionary)
