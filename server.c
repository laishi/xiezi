#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>

#define BUFFER_SIZE 1024
#define DEFAULT_FILE "./public/index.html"

void handle_client(int client_socket) {
    char buffer[BUFFER_SIZE];
    ssize_t bytes_read;
    FILE *file = fopen(DEFAULT_FILE, "r");
    
    if (file == NULL) {
        perror("Failed to open file");
        exit(EXIT_FAILURE);
    }
    
    while ((bytes_read = fread(buffer, 1, BUFFER_SIZE, file)) > 0) {
        if (send(client_socket, buffer, bytes_read, 0) != bytes_read) {
            perror("Failed to send file");
            exit(EXIT_FAILURE);
        }
    }
    
    fclose(file);
    close(client_socket);
}

int main() {
    int server_socket, client_socket;
    struct sockaddr_in server_address, client_address;
    socklen_t client_address_len;
    unsigned short port = 3300;

    // 创建服务器套接字
    server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket == -1) {
        perror("Failed to create server socket");
        exit(EXIT_FAILURE);
    }
    
    // 设置服务器地址
    server_address.sin_family = AF_INET;
    server_address.sin_addr.s_addr = INADDR_ANY;
    server_address.sin_port = htons(port);
    
    // 绑定服务器套接字
    if (bind(server_socket, (struct sockaddr *)&server_address, sizeof(server_address)) == -1) {
        perror("Failed to bind server socket");
        exit(EXIT_FAILURE);
    }
    
    // 监听连接请求
    if (listen(server_socket, 5) == -1) {
        perror("Failed to listen for connections");
        exit(EXIT_FAILURE);
    }
    
    printf("Server listening on port %d\n", port);
    
    while (1) {
        // 接受客户端连接
        client_address_len = sizeof(client_address);
        client_socket = accept(server_socket, (struct sockaddr *)&client_address, &client_address_len);
        if (client_socket == -1) {
            perror("Failed to accept client connection");
            exit(EXIT_FAILURE);
        }
        
        printf("Client connected\n");
        
        // 处理客户端请求
        handle_client(client_socket);
        
        printf("Client disconnected\n");
    }
    
    close(server_socket);
    
    return 0;
}

