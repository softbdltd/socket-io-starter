import styles from './Posts.module.css'

const Posts = ({post}) => {
    console.log('post->', post);
    return (
      <>
          {post && (
              <div className={styles.posts}>
                  <div className={styles.post}>{post}</div>
              </div>
          ) }

      </>
  )
}

export default Posts;
