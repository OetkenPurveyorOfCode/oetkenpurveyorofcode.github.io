#include "pix.h"
#include <stdbool.h>
#define WIDTH 800
#define HEIGHT 600
#define PI 3.1415926535897932384626

uint32_t pixels[WIDTH*HEIGHT] = {0};
float angle = 0;

float sqrtf(float);
float atan2f(float, float);
float sinf(float);
float cosf(float);
bool fenster_mouse_down(void);
float fenster_mouse_x(void);
float fenster_mouse_y(void);

void rotate_point(int* x, int* y, float angle) {
    int dx = *x - WIDTH/2;
    int dy = *y - HEIGHT/2;
    float mag = sqrtf(dx*dx + dy*dy);
    float dir = atan2f(dy, dx) + angle;
    *x = mag*cosf(dir) + WIDTH/2;
    *y = mag*sinf(dir) + HEIGHT/2;

}


int x3 = WIDTH*7/8;
int y3 = HEIGHT*7/8;
uint32_t* render(float dt) {
    angle += 0.5 * PI * dt;
    Canvas canvas = {
        .width=WIDTH,
        .height=HEIGHT,
        .buf=pixels,
    };
    for (int i = 0; i < WIDTH*HEIGHT; i++) {
        pixels[i] = 0;
    }
    int x1 = WIDTH/2;
    int y1 = HEIGHT/8;
    int x2 = WIDTH/8;
    int y2 = HEIGHT/2;
    rotate_point(&x1, &y1, angle);
    rotate_point(&x2, &y2, angle);
    if (fenster_mouse_down()) {
        x3 = fenster_mouse_x();
        y3 = fenster_mouse_y();
    }
    draw_triangle(&canvas, x1, y1, x2, y2, x3, y3, 0xFF000022);
    return pixels;
}
