export const buildCommentTree = (comments: any) => {
  const map = new Map<string, any>();
  const roots: any[] = [];

  comments.forEach((c: any) => {
    map.set(c._id.toString(), { ...c.toObject(), children: [] });
  });

  comments.forEach((c: any) => {
    if (c.parentCommentId) {
      const parent = map.get(c.parentCommentId.toString());
      if (parent) {
        parent.children.push(map.get(c._id.toString()));
      }
    } else {
      roots.push(map.get(c._id.toString()));
    }
  });

  return roots;
};