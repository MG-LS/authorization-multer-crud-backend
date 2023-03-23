import Post from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate("user").exec();

    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: "Нe удалось получить статью",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    //   const postId = req.params.id;

    //  await Post.findOneAndUpdate(
    //     {
    //       _id: postId,
    //     },
    //     {
    //       $inc: { viewsCount: 1 },
    //     },
    //     {
    //       returnDocument: "after",
    //     },
    //     (err, doc) => {
    //       if (err) {
    //         return res.status(500).json({
    //           message: "Нe удалось вернуть статью",
    //         });
    //       }
    //       if (!doc) {
    //         return res.status(404).json({
    //           message: "Статья не найдена",
    //         });
    //       }
    //       res.json(doc);
    //     }
    //   );
    const postId = String(req.params.id);
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" }
    ).exec();

    console.log(`Успешно обновлено: ${updatedPost}`);

    if (!updatedPost) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    return res.json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нe удалось получить статью",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = String(req.params.id);

    const removePost = await Post.findOneAndDelete({ _id: postId }).exec();

    if (!removePost) {
      return res.status(404).json({ message: "Статья не найдена" });
    }

    if (removePost.deletedCount === 0) {
      return res.status(400).json({ message: "Статья не удалена" });
    }

    return res.json({ message: "Статья успешно удалена" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нe удалось удалить статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = String(req.params.id);

    const updatePost = Post.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      }
    ).exec();

    res.json({ message: "Статья успешно обновлена" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нe удалось обновить статью",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нe удалось создать статью",
    });
  }
};
