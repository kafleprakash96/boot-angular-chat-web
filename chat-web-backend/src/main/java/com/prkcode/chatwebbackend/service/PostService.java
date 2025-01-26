package com.prkcode.chatwebbackend.service;

import com.prkcode.chatwebbackend.dto.PostRequest;
import com.prkcode.chatwebbackend.dto.PostResponse;
import com.prkcode.chatwebbackend.dto.UserDto;
import com.prkcode.chatwebbackend.dto.CommentRequest;
import com.prkcode.chatwebbackend.dto.CommentResponse;
import com.prkcode.chatwebbackend.model.Comment;
import com.prkcode.chatwebbackend.model.Like;
import com.prkcode.chatwebbackend.model.Post;
import com.prkcode.chatwebbackend.model.User;
import com.prkcode.chatwebbackend.repository.CommentRepository;
import com.prkcode.chatwebbackend.repository.LikeRepository;
import com.prkcode.chatwebbackend.repository.PostRepository;
import com.prkcode.chatwebbackend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private PostRepository postRepository;
    private CommentRepository commentRepository;
    private LikeRepository likeRepository;
    private UserRepository userRepository;
    private ModelMapper modelMapper;

    public Page<PostResponse> getPosts(int page, int size, UserDetails userDetails) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts;

        if (userDetails == null) {
            posts = postRepository.findByIsPublic(true, pageable);
        } else {
            User user = getUserFromUserDetails(userDetails);
            posts = postRepository.findByIsPublicTrueOrAuthor(user, pageable);
        }

        return posts.map(post -> mapPostToResponse(post, userDetails));
    }

    public PostResponse createPost(PostRequest request, UserDetails userDetails) {
        User user = getUserFromUserDetails(userDetails);

        Post post = new Post();
        modelMapper.map(request, post);
        post.setAuthor(user);

        Post savedPost = postRepository.save(post);
        return mapPostToResponse(savedPost, userDetails);
    }

    public void likePost(Long postId, boolean isLike, UserDetails userDetails) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User user = getUserFromUserDetails(userDetails);

        Like existingLike = likeRepository.findByPostAndAuthor(post, user).orElse(null);

        if (existingLike != null) {
            if (existingLike.isLike() == isLike) {
                likeRepository.delete(existingLike);
            } else {
                existingLike.setLike(isLike);
                likeRepository.save(existingLike);
            }
        } else {
            Like like = new Like();
            like.setPost(post);
            like.setAuthor(user);
            like.setLike(isLike);
            likeRepository.save(like);
        }
    }

    private PostResponse mapPostToResponse(Post post, UserDetails userDetails) {
        PostResponse response = modelMapper.map(post, PostResponse.class);

        // Count likes and dislikes
        long likesCount = post.getLikes().stream().filter(Like::isLike).count();
        long dislikesCount = post.getLikes().stream().filter(like -> !like.isLike()).count();
        response.setLikesCount((int) likesCount);
        response.setDislikesCount((int) dislikesCount);

        // Set user's like status if authenticated
        if (userDetails != null) {
            User user = userRepository.findByUsername(userDetails.getUsername()).orElse(null);
            if (user != null) {
                Optional<Like> userLike = post.getLikes().stream()
                        .filter(like -> like.getAuthor().getId().equals(user.getId()))
                        .findFirst();

                response.setHasLiked(userLike.map(Like::isLike).orElse(false));
                response.setHasDisliked(userLike.map(like -> !like.isLike()).orElse(false));
            }
        }

        return response;
    }

    private CommentResponse mapCommentToResponse(Comment comment) {
        return modelMapper.map(comment, CommentResponse.class);
    }

    private User getUserFromUserDetails(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
