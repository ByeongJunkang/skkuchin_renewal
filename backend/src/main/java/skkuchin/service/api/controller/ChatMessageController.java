package skkuchin.service.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import skkuchin.service.api.dto.CMRespDto;
import skkuchin.service.api.dto.ChatMessageDto;
import skkuchin.service.config.auth.PrincipalDetails;
import skkuchin.service.domain.User.AppUser;
import skkuchin.service.service.ChatMessageService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat/message")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;
    @PostMapping("")
    public ResponseEntity<?> createMessage(@RequestBody ChatMessageDto.Request dto, @AuthenticationPrincipal PrincipalDetails principalDetails){
        AppUser user = principalDetails.getUser();
        chatMessageService.write(user,dto);
        return new ResponseEntity<>(new CMRespDto<>(1, "채팅 메시지 생성 완료", null), HttpStatus.CREATED);

    }

}