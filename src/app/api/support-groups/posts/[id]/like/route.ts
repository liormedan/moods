import { NextRequest, NextResponse } from 'next/server';

// POST /api/support-groups/posts/[id]/like - Like/unlike a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post ID is required',
          message: 'Missing post ID',
        },
        { status: 400 }
      );
    }

    // In a real app, toggle like status in database
    const isLiked = Math.random() > 0.5; // Simulate current like status
    const newLikeStatus = !isLiked;
    const likeChange = newLikeStatus ? 1 : -1;

    console.log(`User ${newLikeStatus ? 'liked' : 'unliked'} post ${id}:`, {
      timestamp: new Date().toISOString(),
      postId: id,
      action: newLikeStatus ? 'like' : 'unlike',
      likeChange,
    });

    // Simulate like delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: {
        postId: id,
        isLiked: newLikeStatus,
        likeChange,
        timestamp: new Date().toISOString(),
      },
      message: `Post ${newLikeStatus ? 'liked' : 'unliked'} successfully`,
    });
  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to like post',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
